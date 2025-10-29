package database

import (
	"context"
	"log"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect(connString string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		log.Fatal("❌ DB connection failed:", err)
	}

	DB = pool
	log.Println("✅ PostgreSQL connected")

	RunMigrations(connString)
}
func RunMigrations(dbURL string) {
	migrationsPath := "file://internal/database/migrations"

	m, err := migrate.New(
		migrationsPath,
		dbURL,
	)
	if err != nil {
		log.Println("Migration init error:", err)
		return
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Println("Migration run error:", err)
		return
	}

	log.Println("✅ Migrations applied from:", migrationsPath)
}
