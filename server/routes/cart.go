package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/mysql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	cartRepository := repositories.RepositoryCart(mysql.DB)
	productRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandlerCart(cartRepository, productRepository)

	e.GET("/carts", h.FindCarts)
	e.GET("/cart/:id", middleware.Auth(h.GetCart))
	e.POST("/cart/:product_id", middleware.Auth(h.CreateCart))
	e.PATCH("/cart/:id", middleware.Auth(h.UpdateCart))
	e.DELETE("/cart/:id", middleware.Auth(h.DeleteCart))
}
