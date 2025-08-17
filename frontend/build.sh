#!/bin/bash

# AuditMesh Frontend Build Script
# This script builds and runs the frontend in Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$FRONTEND_DIR")"
DOCKER_IMAGE="auditmesh-frontend"
DOCKER_TAG="latest"

echo -e "${BLUE}🚀 AuditMesh Frontend Build Script${NC}"
echo -e "${BLUE}================================${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to build the frontend
build_frontend() {
    echo -e "${YELLOW}🔨 Building frontend Docker image...${NC}"
    
    cd "$FRONTEND_DIR"
    
    # Build the Docker image
    docker build \
        --tag "$DOCKER_IMAGE:$DOCKER_TAG" \
        --build-arg NODE_VERSION=18-alpine \
        --file Dockerfile \
        .
    
    echo -e "${GREEN}✅ Frontend Docker image built successfully${NC}"
}

# Function to run the frontend
run_frontend() {
    echo -e "${YELLOW}🚀 Starting frontend container...${NC}"
    
    # Stop and remove existing container if running
    docker stop "$DOCKER_IMAGE" 2>/dev/null || true
    docker rm "$DOCKER_IMAGE" 2>/dev/null || true
    
    # Run the container
    docker run \
        --name "$DOCKER_IMAGE" \
        --detach \
        --publish "5173:80" \
        --network "auditmesh-network" \
        --restart "unless-stopped" \
        "$DOCKER_IMAGE:$DOCKER_TAG"
    
    echo -e "${GREEN}✅ Frontend container started successfully${NC}"
    echo -e "${BLUE}🌐 Frontend available at: http://localhost:5173${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}📋 Frontend container logs:${NC}"
    docker logs -f "$DOCKER_IMAGE"
}

# Function to stop the frontend
stop_frontend() {
    echo -e "${YELLOW}🛑 Stopping frontend container...${NC}"
    docker stop "$DOCKER_IMAGE" 2>/dev/null || true
    docker rm "$DOCKER_IMAGE" 2>/dev/null || true
    echo -e "${GREEN}✅ Frontend container stopped and removed${NC}"
}

# Function to show status
show_status() {
    echo -e "${YELLOW}📊 Frontend container status:${NC}"
    docker ps --filter "name=$DOCKER_IMAGE" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main script logic
main() {
    case "${1:-build}" in
        "build")
            check_docker
            build_frontend
            ;;
        "run")
            check_docker
            build_frontend
            run_frontend
            ;;
        "start")
            check_docker
            run_frontend
            ;;
        "stop")
            stop_frontend
            ;;
        "restart")
            stop_frontend
            sleep 2
            run_frontend
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "clean")
            echo -e "${YELLOW}🧹 Cleaning up Docker images...${NC}"
            docker rmi "$DOCKER_IMAGE:$DOCKER_TAG" 2>/dev/null || true
            echo -e "${GREEN}✅ Cleanup completed${NC}"
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}Usage: $0 [command]${NC}"
            echo -e "${BLUE}Commands:${NC}"
            echo -e "  build   - Build the frontend Docker image"
            echo -e "  run     - Build and run the frontend"
            echo -e "  start   - Start the frontend container"
            echo -e "  stop    - Stop the frontend container"
            echo -e "  restart - Restart the frontend container"
            echo -e "  logs    - Show frontend container logs"
            echo -e "  status  - Show frontend container status"
            echo -e "  clean   - Clean up Docker images"
            echo -e "  help    - Show this help message"
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo -e "${BLUE}Use '$0 help' for usage information${NC}"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
