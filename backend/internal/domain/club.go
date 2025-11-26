package domain

import "time"

type Club struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerID     int       `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ClubMember struct {
	ID       int       `json:"id"`
	UserID   int       `json:"user_id"`
	ClubID   int       `json:"club_id"`
	JoinedAt time.Time `json:"joined_at"`
}
