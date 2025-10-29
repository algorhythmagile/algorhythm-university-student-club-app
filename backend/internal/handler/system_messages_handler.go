package handler

import (
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/service"
	"github.com/gofiber/fiber/v2"
)

func GetMessageHandler(c *fiber.Ctx) error {
	msg, err := service.GetMessage()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	c.Type("json", "utf-8")
	return c.Status(200).JSON(msg)
}
