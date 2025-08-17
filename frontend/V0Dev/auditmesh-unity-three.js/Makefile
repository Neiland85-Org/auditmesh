# AuditMesh Docker Management

.PHONY: help build up down logs clean dev prod restart

# Default target
help:
	@echo "AuditMesh Docker Commands:"
	@echo "  make build     - Build all services"
	@echo "  make up        - Start all services in production mode"
	@echo "  make dev       - Start all services in development mode"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - Show logs for all services"
	@echo "  make restart   - Restart all services"
	@echo "  make clean     - Remove all containers, volumes, and images"
	@echo "  make web-logs  - Show logs for web service only"
	@echo "  make web-shell - Access web container shell"

# Build all services
build:
	docker-compose build

# Start services in production mode
up:
	docker-compose up -d

# Start services in development mode
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all services
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Show web service logs only
web-logs:
	docker-compose logs -f web

# Access web container shell
web-shell:
	docker-compose exec web sh

# Restart all services
restart:
	docker-compose restart

# Clean up everything
clean:
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

# Database operations
db-migrate:
	docker-compose exec ms-gateway npm run migrate

db-seed:
	docker-compose exec ms-gateway npm run seed

# Health check
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo "\nWeb service health:"
	@curl -f http://localhost:3001/health || echo "Web service not healthy"
	@echo "\nGateway service health:"
	@curl -f http://localhost:3000/health || echo "Gateway service not healthy"
