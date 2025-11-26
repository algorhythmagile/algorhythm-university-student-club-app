package repository

import (
	"context"
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ClubRepository struct {
	db *pgxpool.Pool
}

func NewClubRepository(db *pgxpool.Pool) *ClubRepository {
	return &ClubRepository{db: db}
}

func (r *ClubRepository) CreateClub(ctx context.Context, club *domain.Club) error {
	query := `
		INSERT INTO clubs (name, description, owner_id, created_at, updated_at)
		VALUES ($1, $2, $3, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, club.Name, club.Description, club.OwnerID).Scan(&club.ID, &club.CreatedAt, &club.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create club: %w", err)
	}
	return nil
}

func (r *ClubRepository) GetAllClubs(ctx context.Context) ([]*domain.Club, error) {
	query := `SELECT id, name, description, owner_id, created_at, updated_at FROM clubs`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query clubs: %w", err)
	}
	defer rows.Close()

	var clubs []*domain.Club
	for rows.Next() {
		var club domain.Club
		var ownerID *int // Handle nullable owner_id if necessary, though we made it FK
		if err := rows.Scan(&club.ID, &club.Name, &club.Description, &ownerID, &club.CreatedAt, &club.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan club: %w", err)
		}
		if ownerID != nil {
			club.OwnerID = *ownerID
		}
		clubs = append(clubs, &club)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return clubs, nil
}

func (r *ClubRepository) JoinClub(ctx context.Context, userID, clubID int) error {
	query := `INSERT INTO club_members (user_id, club_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	_, err := r.db.Exec(ctx, query, userID, clubID)
	if err != nil {
		return fmt.Errorf("failed to join club: %w", err)
	}
	return nil
}

func (r *ClubRepository) GetClubsByMember(ctx context.Context, userID int) ([]*domain.Club, error) {
	query := `
		SELECT c.id, c.name, c.description, c.owner_id, c.created_at, c.updated_at
		FROM clubs c
		JOIN club_members cm ON c.id = cm.club_id
		WHERE cm.user_id = $1
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query member clubs: %w", err)
	}
	defer rows.Close()

	var clubs []*domain.Club
	for rows.Next() {
		var club domain.Club
		var ownerID *int
		if err := rows.Scan(&club.ID, &club.Name, &club.Description, &ownerID, &club.CreatedAt, &club.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan club: %w", err)
		}
		if ownerID != nil {
			club.OwnerID = *ownerID
		}
		clubs = append(clubs, &club)
	}
	return clubs, nil
}

func (r *ClubRepository) GetClubsByOwner(ctx context.Context, ownerID int) ([]*domain.Club, error) {
	query := `SELECT id, name, description, owner_id, created_at, updated_at FROM clubs WHERE owner_id = $1`
	rows, err := r.db.Query(ctx, query, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query owned clubs: %w", err)
	}
	defer rows.Close()

	var clubs []*domain.Club
	for rows.Next() {
		var club domain.Club
		var oID *int
		if err := rows.Scan(&club.ID, &club.Name, &club.Description, &oID, &club.CreatedAt, &club.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan club: %w", err)
		}
		if oID != nil {
			club.OwnerID = *oID
		}
		clubs = append(clubs, &club)
	}
	return clubs, nil
}

func (r *ClubRepository) GetClubMembers(ctx context.Context, clubID int) ([]*domain.ClubMember, error) {
	query := `SELECT id, user_id, club_id, joined_at FROM club_members WHERE club_id = $1`
	rows, err := r.db.Query(ctx, query, clubID)
	if err != nil {
		return nil, fmt.Errorf("failed to query club members: %w", err)
	}
	defer rows.Close()

	var members []*domain.ClubMember
	for rows.Next() {
		var member domain.ClubMember
		if err := rows.Scan(&member.ID, &member.UserID, &member.ClubID, &member.JoinedAt); err != nil {
			return nil, fmt.Errorf("failed to scan member: %w", err)
		}
		members = append(members, &member)
	}
	return members, nil
}
