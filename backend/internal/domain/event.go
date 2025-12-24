package domain

import "time"

type Event struct {
	ID          int       `json:"id"`
	ClubID      int       `json:"club_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventDate   time.Time `json:"event_date"`
	Location    string    `json:"location"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type EventParticipant struct {
	ID       int       `json:"id"`
	EventID  int       `json:"event_id"`
	UserID   int       `json:"user_id"`
	JoinedAt time.Time `json:"joined_at"`
}

type EventComment struct {
	ID        int       `json:"id"`
	EventID   int       `json:"event_id"`
	UserID    int       `json:"user_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	// Join fields
	UserName string `json:"user_name,omitempty"`
}

type EventLike struct {
	UserID    int       `json:"user_id"`
	EventID   int       `json:"event_id"`
	CreatedAt time.Time `json:"created_at"`
}
