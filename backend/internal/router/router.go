package router

import (
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/handler"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/system-message", handler.GetMessageHandler)
}
