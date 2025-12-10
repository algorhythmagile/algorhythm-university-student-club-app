package router

import (
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/handler"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, authHandler *handler.AuthHandler, clubHandler *handler.ClubHandler, eventHandler *handler.EventHandler) {
	fmt.Println("Registering routes...")
	api := app.Group("/api")

	api.Get("/system-message", handler.GetMessageHandler)

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", authHandler.Me) // authHandler.Me handles token parsing manually, but could use middleware too. Leaving as is for now.

	// Club Routes
	clubs := api.Group("/clubs")
	clubs.Get("/", clubHandler.GetAllClubs)               // Public
	clubs.Get("/:id/members", clubHandler.GetClubMembers) // Public? Or Protected? Assuming Public for now.

	// Protected Club Routes
	clubsProtected := api.Group("/clubs")
	clubsProtected.Use(middleware.Protected())
	clubsProtected.Post("/", clubHandler.CreateClub)
	clubsProtected.Post("/:id/join", clubHandler.JoinClub)
	clubsProtected.Get("/my-memberships", clubHandler.GetMyClubs)
	clubsProtected.Get("/my-clubs", clubHandler.GetManagedClubs)

	clubs.Post("/:id/events", middleware.Protected(), eventHandler.CreateEvent) // Protected
	clubs.Get("/:id/events", eventHandler.GetClubEvents)                        // Public

	// Event Routes
	events := api.Group("/events")
	events.Get("/", eventHandler.GetAllEvents) // Public

	// Protected Event Routes
	eventsProtected := api.Group("/events")
	eventsProtected.Use(middleware.Protected())
	eventsProtected.Post("/:id/join", eventHandler.JoinEvent)
	eventsProtected.Get("/:id/participants", eventHandler.GetEventParticipants) // Maybe protected?
	eventsProtected.Get("/my-joined", eventHandler.GetMyJoinedEvents)
	eventsProtected.Get("/my-managed", eventHandler.GetMyManagedEvents)
}
