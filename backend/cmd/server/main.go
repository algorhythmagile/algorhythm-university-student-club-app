package main

import (
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/config"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/database"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/router"
	"github.com/gofiber/fiber/v2"
)

func main() {
	config.LoadConfig()
	dbUrl := config.GetEnv("DATABASE_URL")
	fmt.Println("Database URL:", dbUrl)
	database.Connect(dbUrl)

	app := fiber.New()
	router.SetupRoutes(app)
	app.Listen(":3000")

}
