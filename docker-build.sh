#!/bin/bash

# Source environment variables
source ./env.sh

# Export CR_PAT for Container Registry authentication
export CR_PAT="${CR_PAT:-$GITHUB_TOKEN}"

# Function to build and push Docker images
build_and_push() {
    local service=$1

    echo "🔨 Building ${service}..."

    # Build image with specific platform and OpenContainers labels
    if ! docker build \
        --platform "${DOCKER_PLATFORM}" \
        --build-arg GIT_REPOSITORY="https://github.com/${GITHUB_ORG}/${GITHUB_REPO}" \
        -t "${REGISTRY}/${service}:sha-${GIT_SHA}" \
        "./services/${service}"; then
        echo "❌ Failed to build ${service}"
        return 1
    fi

    # Tag images
    docker tag "${REGISTRY}/${service}:sha-${GIT_SHA}" "${REGISTRY}/${service}:branch-${GIT_BRANCH//\//-}"
    docker tag "${REGISTRY}/${service}:sha-${GIT_SHA}" "${REGISTRY}/${service}:dev"

    echo "🏷️  Tagged ${service} images"

    # Push images
    echo "📤 Pushing ${service} images..."
    
    # Push SHA tag
    if ! docker push "${REGISTRY}/${service}:sha-${GIT_SHA}"; then
        echo "❌ Failed to push ${service}:sha-${GIT_SHA}"
        return 1
    fi
    
    # Push branch tag
    if ! docker push "${REGISTRY}/${service}:branch-${GIT_BRANCH//\//-}"; then
        echo "❌ Failed to push ${service}:branch-${GIT_BRANCH//\//-}"
        return 1
    fi
    
    # Push dev tag
    if ! docker push "${REGISTRY}/${service}:dev"; then
        echo "❌ Failed to push ${service}:dev"
        return 1
    fi

    echo "✅ Successfully built and pushed ${service}"
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
    echo "${CR_PAT}" | docker login "${DOCKER_REGISTRY}" -u "${DOCKER_USERNAME}" --password-stdin

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
