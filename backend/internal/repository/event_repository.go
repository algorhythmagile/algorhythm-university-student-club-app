package repository

import (
	"context"
	"fmt"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EventRepository struct {
	db *pgxpool.Pool
}

func NewEventRepository(db *pgxpool.Pool) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) CreateEvent(ctx context.Context, event *domain.Event) error {
	query := `
		INSERT INTO events (club_id, title, description, event_date, location, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(
		ctx,
		query,
		event.ClubID,
		event.Title,
		event.Description,
		event.EventDate,
		event.Location,
	).Scan(&event.ID, &event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create event: %w", err)
	}
	return nil
}

func (r *EventRepository) GetEventsByClubID(ctx context.Context, clubID int) ([]domain.Event, error) {
	query := `
		SELECT id, club_id, title, description, event_date, location, created_at, updated_at
		FROM events
		WHERE club_id = $1
		ORDER BY event_date ASC
	`
	rows, err := r.db.Query(ctx, query, clubID)
	if err != nil {
		return nil, fmt.Errorf("failed to query events: %w", err)
	}
	defer rows.Close()

	var events []domain.Event
	for rows.Next() {
		var e domain.Event
		if err := rows.Scan(
			&e.ID, &e.ClubID, &e.Title, &e.Description, &e.EventDate, &e.Location, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *EventRepository) GetAllEvents(ctx context.Context) ([]domain.Event, error) {
	query := `
		SELECT id, club_id, title, description, event_date, location, created_at, updated_at
		FROM events
		ORDER BY event_date ASC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query events: %w", err)
	}
	defer rows.Close()

	var events []domain.Event
	for rows.Next() {
		var e domain.Event
		if err := rows.Scan(
			&e.ID, &e.ClubID, &e.Title, &e.Description, &e.EventDate, &e.Location, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *EventRepository) JoinEvent(ctx context.Context, eventID, userID int) error {
	query := `INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	_, err := r.db.Exec(ctx, query, eventID, userID)
	if err != nil {
		return fmt.Errorf("failed to join event: %w", err)
	}
	return nil
}

func (r *EventRepository) GetEventParticipants(ctx context.Context, eventID int) ([]domain.EventParticipant, error) {
	query := `SELECT id, event_id, user_id, joined_at FROM event_participants WHERE event_id = $1`
	rows, err := r.db.Query(ctx, query, eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to query participants: %w", err)
	}
	defer rows.Close()

	var participants []domain.EventParticipant
	for rows.Next() {
		var p domain.EventParticipant
		if err := rows.Scan(&p.ID, &p.EventID, &p.UserID, &p.JoinedAt); err != nil {
			return nil, fmt.Errorf("failed to scan participant: %w", err)
		}
		participants = append(participants, p)
	}
	return participants, nil
}

func (r *EventRepository) GetEventsByUserID(ctx context.Context, userID int) ([]domain.Event, error) {
	query := `
		SELECT e.id, e.club_id, e.title, e.description, e.event_date, e.location, e.created_at, e.updated_at
		FROM events e
		JOIN event_participants ep ON e.id = ep.event_id
		WHERE ep.user_id = $1
		ORDER BY e.event_date ASC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user events: %w", err)
	}
	defer rows.Close()

	var events []domain.Event
	for rows.Next() {
		var e domain.Event
		if err := rows.Scan(
			&e.ID, &e.ClubID, &e.Title, &e.Description, &e.EventDate, &e.Location, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *EventRepository) GetEventsByOwnerID(ctx context.Context, ownerID int) ([]domain.Event, error) {
	query := `
		SELECT e.id, e.club_id, e.title, e.description, e.event_date, e.location, e.created_at, e.updated_at
		FROM events e
		JOIN clubs c ON e.club_id = c.id
		WHERE c.owner_id = $1
		ORDER BY e.event_date ASC
	`
	rows, err := r.db.Query(ctx, query, ownerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query owner events: %w", err)
	}
	defer rows.Close()

	var events []domain.Event
	for rows.Next() {
		var e domain.Event
		if err := rows.Scan(
			&e.ID, &e.ClubID, &e.Title, &e.Description, &e.EventDate, &e.Location, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *EventRepository) CreateComment(ctx context.Context, comment *domain.EventComment) error {
	query := `
		INSERT INTO event_comments (event_id, user_id, content, created_at, updated_at)
		VALUES ($1, $2, $3, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(
		ctx,
		query,
		comment.EventID,
		comment.UserID,
		comment.Content,
	).Scan(&comment.ID, &comment.CreatedAt, &comment.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create comment: %w", err)
	}
	return nil
}

func (r *EventRepository) GetCommentsByEventID(ctx context.Context, eventID int) ([]domain.EventComment, error) {
	query := `
		SELECT c.id, c.event_id, c.user_id, c.content, c.created_at, c.updated_at, u.username
		FROM event_comments c
		JOIN users u ON c.user_id = u.id
		WHERE c.event_id = $1
		ORDER BY c.created_at DESC
	`
	rows, err := r.db.Query(ctx, query, eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to query comments: %w", err)
	}
	defer rows.Close()

	var comments []domain.EventComment
	for rows.Next() {
		var c domain.EventComment
		if err := rows.Scan(
			&c.ID, &c.EventID, &c.UserID, &c.Content, &c.CreatedAt, &c.UpdatedAt, &c.UserName,
		); err != nil {
			return nil, fmt.Errorf("failed to scan comment: %w", err)
		}
		comments = append(comments, c)
	}
	return comments, nil
}

func (r *EventRepository) ToggleLike(ctx context.Context, eventID, userID int) (bool, error) {
	// Check if like exists
	var exists bool
	checkQuery := `SELECT EXISTS(SELECT 1 FROM event_likes WHERE event_id = $1 AND user_id = $2)`
	err := r.db.QueryRow(ctx, checkQuery, eventID, userID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check like status: %w", err)
	}

	if exists {
		// Unlike
		_, err := r.db.Exec(ctx, `DELETE FROM event_likes WHERE event_id = $1 AND user_id = $2`, eventID, userID)
		if err != nil {
			return false, fmt.Errorf("failed to unlike event: %w", err)
		}
		return false, nil // Liked = false
	} else {
		// Like
		_, err := r.db.Exec(ctx, `INSERT INTO event_likes (event_id, user_id) VALUES ($1, $2)`, eventID, userID)
		if err != nil {
			return false, fmt.Errorf("failed to like event: %w", err)
		}
		return true, nil // Liked = true
	}
}

func (r *EventRepository) GetLikesCount(ctx context.Context, eventID int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM event_likes WHERE event_id = $1`
	err := r.db.QueryRow(ctx, query, eventID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to get likes count: %w", err)
	}
	return count, nil
}

func (r *EventRepository) HasUserLikedEvent(ctx context.Context, eventID, userID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM event_likes WHERE event_id = $1 AND user_id = $2)`
	err := r.db.QueryRow(ctx, query, eventID, userID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check like status: %w", err)
	}
	return exists, nil
}
