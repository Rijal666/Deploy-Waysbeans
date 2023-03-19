package handlers

import (
	"net/http"
	"strconv"
	cartsdto "waysbeans/dto/cart"
	dto "waysbeans/dto/result"
	"waysbeans/models"
	"waysbeans/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository    repositories.CartRepository
	ProductRepository repositories.ProductRepository
}

func HandlerCart(CartRepository repositories.CartRepository, ProductRepository repositories.ProductRepository) *handlerCart {
	return &handlerCart{
		CartRepository:    CartRepository,
		ProductRepository: ProductRepository,
	}
}

func (h *handlerCart) FindCarts(c echo.Context) error {
	carts, err := h.CartRepository.FindCarts()
		if err != nil {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
		}

		if len(carts) > 0 {
			return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all carts was successfully obtained", Data: carts})
		} else {
			return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
		}
	// userLogin := c.Get("userLogin")
	// userAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)
	// if userAdmin {
	// 	carts, err := h.CartRepository.FindCarts()
	// 	if err != nil {
	// 		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	// 	}

	// 	if len(carts) > 0 {
	// 		return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Data for all carts was successfully obtained", Data: carts})
	// 	} else {
	// 		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: "No record found"})
	// 	}
	// } else {
	// 	return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Status: http.StatusUnauthorized, Message: "Sorry, you're not Admin"})
	// }
}

func (h *handlerCart) GetCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data successfully obtained", Data: cart})
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	request := new(cartsdto.CartRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)
	productId, _ := strconv.Atoi(c.Param("product_id"))

	product, err := h.ProductRepository.GetProduct(productId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	product.Stock = product.Stock - request.OrderQuantity
	_, err = h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	cart := models.Cart{
		ProductID:     productId,
		OrderQuantity: request.OrderQuantity,
		UserID:        int(userId),
	}

	data, err := h.CartRepository.CreateCart(cart)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data created successfully", Data: convertResponseCart(data)})
}

func (h *handlerCart) UpdateCart(c echo.Context) error {
	request := new(cartsdto.CartRequest)
	if err := c.Bind(&request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	if request.ProductID != 0 {
		cart.ProductID = request.ProductID
	}

	if request.OrderQuantity != 0 {
		cart.OrderQuantity = request.OrderQuantity
	}

	userLogin := c.Get("userLogin")
	userId := userLogin.(jwt.MapClaims)["id"].(float64)

	if request.UserID != 0 {
		cart.UserID = int(userId)
	}

	data, err := h.CartRepository.UpdateCart(cart)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data updated successfully", Data: convertResponseCart(data)})
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.GetCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	cartOrderQuantity := cart.OrderQuantity

	data, err := h.CartRepository.DeleteCart(cart)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Status: http.StatusInternalServerError, Message: err.Error()})
	}

	product, err := h.ProductRepository.GetProduct(cart.ProductID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}
	product.Stock = product.Stock + cartOrderQuantity
	_, err = h.ProductRepository.UpdateProduct(product)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Status: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Status: http.StatusOK, Message: "Cart data updated successfully", Data: convertResponseCart(data)})
}

func convertResponseCart(u models.Cart) cartsdto.CartResponse {
	return cartsdto.CartResponse{
		ProductID:     u.ProductID,
		OrderQuantity: u.OrderQuantity,
		UserID:        u.UserID,
	}
}
