package main

import (
	"fmt"
	"log"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/config"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/database"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/handler"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/repository"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/router"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	config.LoadConfig()
	dbUrl := config.GetEnv("DATABASE_URL")
	fmt.Println("Database URL:", dbUrl)
	database.Connect(dbUrl)

	app := fiber.New()

	app.Use(cors.New())
	app.Use(requestid.New())
	app.Use(logger.New())
	app.Use(recover.New())

	userRepo := repository.NewUserRepository(database.DB)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	clubRepo := repository.NewClubRepository(database.DB)
	clubService := service.NewClubService(clubRepo)
	clubHandler := handler.NewClubHandler(clubService)

	eventRepo := repository.NewEventRepository(database.DB)
	eventHandler := handler.NewEventHandler(eventRepo)

	fmt.Println("Setting up routes...")
	router.SetupRoutes(app, authHandler, clubHandler, eventHandler)
	log.Fatal(app.Listen(":" + config.GetEnv("PORT")))
}
