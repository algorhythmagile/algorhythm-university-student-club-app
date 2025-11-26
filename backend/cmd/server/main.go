package main

import (
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/config"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/database"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/handler"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/repository"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/router"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadConfig()
	dbUrl := config.GetEnv("DATABASE_URL")
	fmt.Println("Database URL:", dbUrl)
	database.Connect(dbUrl)

	app := fiber.New()

	app.Use(cors.New())

	userRepo := repository.NewUserRepository(database.DB)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	clubRepo := repository.NewClubRepository(database.DB)
	clubService := service.NewClubService(clubRepo)
	clubHandler := handler.NewClubHandler(clubService)

	fmt.Println("Setting up routes...")
	router.SetupRoutes(app, authHandler, clubHandler)
	app.Listen(":" + config.GetEnv("PORT"))
}
