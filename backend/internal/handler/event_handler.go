package handler

import (
	"strconv"
	"time"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/domain"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type EventHandler struct {
	repo *repository.EventRepository
}

func NewEventHandler(repo *repository.EventRepository) *EventHandler {
	return &EventHandler{repo: repo}
}

// CreateEvent handles POST /api/clubs/:id/events
func (h *EventHandler) CreateEvent(c *fiber.Ctx) error {
	clubID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid club ID"})
	}

	var req struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		EventDate   time.Time `json:"event_date"`
		Location    string    `json:"location"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	event := &domain.Event{
		ClubID:      clubID,
		Title:       req.Title,
		Description: req.Description,
		EventDate:   req.EventDate,
		Location:    req.Location,
	}

	if err := h.repo.CreateEvent(c.Context(), event); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create event"})
	}

	return c.Status(fiber.StatusCreated).JSON(event)
}

// GetClubEvents handles GET /api/clubs/:id/events
func (h *EventHandler) GetClubEvents(c *fiber.Ctx) error {
	clubID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid club ID"})
	}

	events, err := h.repo.GetEventsByClubID(c.Context(), clubID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch events"})
	}

	return c.JSON(events)
}

// GetAllEvents handles GET /api/events
func (h *EventHandler) GetAllEvents(c *fiber.Ctx) error {
	events, err := h.repo.GetAllEvents(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch events"})
	}

	return c.JSON(events)
}

// JoinEvent handles POST /api/events/:id/join
func (h *EventHandler) JoinEvent(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	userID := c.Locals("userID").(int)
	if err := h.repo.JoinEvent(c.Context(), eventID, userID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to join event"})
	}

	return c.JSON(fiber.Map{"message": "Successfully joined event"})
}

// GetEventParticipants handles GET /api/events/:id/participants
func (h *EventHandler) GetEventParticipants(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	participants, err := h.repo.GetEventParticipants(c.Context(), eventID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch participants"})
	}

	return c.JSON(participants)
}

// GetMyJoinedEvents handles GET /api/events/my-joined
func (h *EventHandler) GetMyJoinedEvents(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	events, err := h.repo.GetEventsByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch joined events"})
	}
	return c.JSON(events)
}

// GetMyManagedEvents handles GET /api/events/my-managed
func (h *EventHandler) GetMyManagedEvents(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	events, err := h.repo.GetEventsByOwnerID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch managed events"})
	}
	return c.JSON(events)
}

// AddComment handles POST /api/events/:id/comments
func (h *EventHandler) AddComment(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	userID := c.Locals("userID").(int)
	var req struct {
		Content string `json:"content"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Content cannot be empty"})
	}

	comment := &domain.EventComment{
		EventID: eventID,
		UserID:  userID,
		Content: req.Content,
	}

	if err := h.repo.CreateComment(c.Context(), comment); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add comment"})
	}

	return c.Status(fiber.StatusCreated).JSON(comment)
}

// GetComments handles GET /api/events/:id/comments
func (h *EventHandler) GetComments(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	comments, err := h.repo.GetCommentsByEventID(c.Context(), eventID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch comments"})
	}

	return c.JSON(comments)
}

// ToggleLike handles POST /api/events/:id/like
func (h *EventHandler) ToggleLike(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	userID := c.Locals("userID").(int)
	liked, err := h.repo.ToggleLike(c.Context(), eventID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to toggle like"})
	}

	return c.JSON(fiber.Map{"liked": liked})
}

// GetLikes handles GET /api/events/:id/likes
func (h *EventHandler) GetLikes(c *fiber.Ctx) error {
	eventID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid event ID"})
	}

	count, err := h.repo.GetLikesCount(c.Context(), eventID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get likes count"})
	}

	var liked bool
	// If user is authenticated, check if they liked it
	userIDVal := c.Locals("userID")
	if userIDVal != nil {
		userID := userIDVal.(int)
		liked, _ = h.repo.HasUserLikedEvent(c.Context(), eventID, userID)
	}

	return c.JSON(fiber.Map{
		"count": count,
		"liked": liked,
	})
}
