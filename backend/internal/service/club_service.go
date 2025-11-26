package service

import (
	"context"
	"errors"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/repository"
)

type ClubService struct {
	clubRepo *repository.ClubRepository
}

func NewClubService(clubRepo *repository.ClubRepository) *ClubService {
	return &ClubService{clubRepo: clubRepo}
}

func (s *ClubService) CreateClub(ctx context.Context, name, description string, ownerID int) (*domain.Club, error) {
	if name == "" {
		return nil, errors.New("club name is required")
	}

	club := &domain.Club{
		Name:        name,
		Description: description,
		OwnerID:     ownerID,
	}

	err := s.clubRepo.CreateClub(ctx, club)
	if err != nil {
		return nil, err
	}

	return club, nil
}

func (s *ClubService) GetAllClubs(ctx context.Context) ([]*domain.Club, error) {
	return s.clubRepo.GetAllClubs(ctx)
}

func (s *ClubService) JoinClub(ctx context.Context, userID, clubID int) error {
	return s.clubRepo.JoinClub(ctx, userID, clubID)
}

func (s *ClubService) GetMyClubs(ctx context.Context, userID int) ([]*domain.Club, error) {
	return s.clubRepo.GetClubsByMember(ctx, userID)
}

func (s *ClubService) GetManagedClubs(ctx context.Context, ownerID int) ([]*domain.Club, error) {
	return s.clubRepo.GetClubsByOwner(ctx, ownerID)
}

func (s *ClubService) GetClubMembers(ctx context.Context, clubID int) ([]*domain.ClubMember, error) {
	return s.clubRepo.GetClubMembers(ctx, clubID)
}
