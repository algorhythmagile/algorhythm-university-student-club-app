package router

import (
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/handler"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, authHandler *handler.AuthHandler, clubHandler *handler.ClubHandler) {
	fmt.Println("Registering routes...")
	api := app.Group("/api")

	api.Get("/system-message", handler.GetMessageHandler)

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", authHandler.Me)

	clubs := api.Group("/clubs")
	clubs.Post("/", clubHandler.CreateClub)
	clubs.Get("/", clubHandler.GetAllClubs)
	clubs.Post("/:id/join", clubHandler.JoinClub)
	clubs.Get("/my-memberships", clubHandler.GetMyClubs)
	clubs.Get("/my-clubs", clubHandler.GetManagedClubs)
	clubs.Get("/:id/members", clubHandler.GetClubMembers)
}
