package authdto

type LoginResponse struct {
	ID 		int 	`json:"id"`
	IsAdmin bool   `json:"is_admin" gorm:"type: bool"`
	Email 	string `gorm:"type: varchar(255)" json:"email"`
	Token 	string `gorm:"type: varchar(255)" json:"token"`
}
