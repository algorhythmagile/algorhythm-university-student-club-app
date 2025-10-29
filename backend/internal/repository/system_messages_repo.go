package repository

import (
	"context"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/database"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
)

func GetSystemMessage() (*domain.SystemMessage, error) {
	row := database.DB.QueryRow(context.Background(),
		"SELECT id, message_text FROM system_messages LIMIT 1")

	var msg domain.SystemMessage
	err := row.Scan(&msg.ID, &msg.MessageText)
	return &msg, err
}
