#!/bin/bash

# Source environment variables
source ./env.sh

# Function to build and push Docker images
build_and_push() {
    local service=$1
    
    echo "🔨 Building ${service}..."
    
    # Build image with specific platform
    docker build \
        --platform "${DOCKER_PLATFORM}" \
        -t "${REGISTRY}/${service}:sha-${GIT_SHA}" \
        "./services/${service}"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build ${service}"
        return 1
    fi
    
    # Tag images
    docker tag "${REGISTRY}/${service}:sha-${GIT_SHA}" "${REGISTRY}/${service}:branch-${GIT_BRANCH}"
    docker tag "${REGISTRY}/${service}:sha-${GIT_SHA}" "${REGISTRY}/${service}:dev"
    
    echo "🏷️  Tagged ${service} images"
    
    # Push images
    echo "📤 Pushing ${service} images..."
    docker push "${REGISTRY}/${service}:sha-${GIT_SHA}"
    docker push "${REGISTRY}/${service}:branch-${GIT_BRANCH}"
    docker push "${REGISTRY}/${service}:dev"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully built and pushed ${service}"
    else
        echo "❌ Failed to push ${service}"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Starting Docker build and push process..."
    echo "   Registry: ${REGISTRY}"
    echo "   Platform: ${DOCKER_PLATFORM}"
    echo "   Git SHA: ${GIT_SHA}"
    echo "   Git Branch: ${GIT_BRANCH}"
    echo ""
    
    # Check if Docker is available
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed or not in PATH"
        echo "   Please install Docker Desktop or Docker CLI"
        exit 1
    fi
    
    # Check if GitHub CLI is authenticated
    if ! gh auth status &> /dev/null; then
        echo "❌ GitHub CLI not authenticated"
        echo "   Run: gh auth login"
        exit 1
    fi
    
    # Login to GitHub Container Registry
    echo "🔐 Logging into GitHub Container Registry..."
    echo "${GITHUB_TOKEN}" | docker login "${DOCKER_REGISTRY}" -u "${DOCKER_USERNAME}" --password-stdin
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to login to GitHub Container Registry"
        exit 1
    fi
    
    echo "✅ Logged into ${DOCKER_REGISTRY}"
    echo ""
    
    # Build and push each service
    local failed_services=()
    
    for service in "${SERVICES[@]}"; do
        if ! build_and_push "$service"; then
            failed_services+=("$service")
        fi
        echo ""
    done
    
    # Summary
    if [ ${#failed_services[@]} -eq 0 ]; then
        echo "🎉 All services built and pushed successfully!"
    else
        echo "⚠️  Some services failed:"
        for service in "${failed_services[@]}"; do
            echo "   ❌ ${service}"
        done
        exit 1
    fi
}

# Run main function
main "$@"
