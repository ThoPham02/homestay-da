package svc

import (
	"homestay-be/cmd/config"
	"homestay-be/cmd/database/mysql"
	"homestay-be/cmd/database/repo"
	"log"

	"github.com/jmoiron/sqlx"
)

type ServiceContext struct {
	Config config.Config
	DB     *sqlx.DB
	
	// Repositories
	UserRepo             repo.UserRepository
	HomestayRepo         repo.HomestayRepository
	RoomRepo             repo.RoomRepository
	RoomAvailabilityRepo repo.RoomAvailabilityRepository
	BookingRequestRepo   repo.BookingRequestRepository
	BookingRepo          repo.BookingRepository
	PaymentRepo          repo.PaymentRepository
	ReviewRepo           repo.ReviewRepository
}

func NewServiceContext(c config.Config) *ServiceContext {
	// Khởi tạo database connection
	dbConfig := &mysql.Config{
		Host:     c.Database.Host,
		Port:     c.Database.Port,
		User:     c.Database.User,
		Password: c.Database.Password,
		DBName:   c.Database.DBName,
		SSLMode:  c.Database.SSLMode,
	}
	
	db, err := mysql.NewConnection(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	// Khởi tạo repository factory
	repoFactory := mysql.NewRepositoryFactory(db)
	
	return &ServiceContext{
		Config: c,
		DB:     db,
		
		// Repositories
		UserRepo:             repoFactory.UserRepo,
		HomestayRepo:         repoFactory.HomestayRepo,
		RoomRepo:             repoFactory.RoomRepo,
		RoomAvailabilityRepo: repoFactory.RoomAvailabilityRepo,
		BookingRequestRepo:   repoFactory.BookingRequestRepo,
		BookingRepo:          repoFactory.BookingRepo,
		PaymentRepo:          repoFactory.PaymentRepo,
		ReviewRepo:           repoFactory.ReviewRepo,
	}
}

// Close đóng database connection
func (svc *ServiceContext) Close() error {
	if svc.DB != nil {
		return mysql.CloseConnection(svc.DB)
	}
	return nil
}
