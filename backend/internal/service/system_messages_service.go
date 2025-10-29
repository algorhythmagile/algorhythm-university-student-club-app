package service

import (
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/repository"
)

func GetMessage() (*domain.SystemMessage, error) {

	return repository.GetSystemMessage()
}
