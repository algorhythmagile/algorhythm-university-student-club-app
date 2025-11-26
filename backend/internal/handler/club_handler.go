package handler

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/config"
	"github.com/algorhythmagile/algorhythm-university-student-club-app/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type ClubHandler struct {
	clubService *service.ClubService
}

func NewClubHandler(clubService *service.ClubService) *ClubHandler {
	return &ClubHandler{clubService: clubService}
}

type CreateClubRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (h *ClubHandler) getUserIDFromToken(c *fiber.Ctx) (int, error) {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return 0, fmt.Errorf("missing authorization header")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetEnv("JWT_SECRET")), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if userIDFloat, ok := claims["user_id"].(float64); ok {
			return int(userIDFloat), nil
		}
	}

	return 0, fmt.Errorf("invalid token claims")
}

func (h *ClubHandler) CreateClub(c *fiber.Ctx) error {
	userID, err := h.getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var req CreateClubRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	club, err := h.clubService.CreateClub(c.Context(), req.Name, req.Description, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Club created successfully",
		"club":    club,
	})
}

func (h *ClubHandler) GetAllClubs(c *fiber.Ctx) error {
	clubs, err := h.clubService.GetAllClubs(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not fetch clubs"})
	}

	return c.Status(fiber.StatusOK).JSON(clubs)
}

func (h *ClubHandler) JoinClub(c *fiber.Ctx) error {
	userID, err := h.getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	clubID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid club ID"})
	}

	if err := h.clubService.JoinClub(c.Context(), userID, clubID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Joined club successfully"})
}

func (h *ClubHandler) GetMyClubs(c *fiber.Ctx) error {
	userID, err := h.getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	clubs, err := h.clubService.GetMyClubs(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(clubs)
}

func (h *ClubHandler) GetManagedClubs(c *fiber.Ctx) error {
	userID, err := h.getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	clubs, err := h.clubService.GetManagedClubs(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(clubs)
}

func (h *ClubHandler) GetClubMembers(c *fiber.Ctx) error {
	// Ideally check if user is owner, but for now just list members
	clubID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid club ID"})
	}

	members, err := h.clubService.GetClubMembers(c.Context(), clubID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(members)
}
