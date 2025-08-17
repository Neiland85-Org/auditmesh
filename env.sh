#!/bin/bash

# GitHub Configuration
export GITHUB_ORG="Neiland85-Org"
export GITHUB_REPO="auditmesh"
export GITHUB_TOKEN="$(gh auth token)"
if [ -z "${GITHUB_TOKEN}" ]; then
  echo "⚠️  Warning: GITHUB_TOKEN is not set. Please export your GitHub token before sourcing this script."
fi
# Docker Registry Configuration
export DOCKER_REGISTRY="ghcr.io"
export DOCKER_NAMESPACE="${GITHUB_ORG}"
# Set DOCKER_USERNAME from environment, or fail if not set
if [ -z "${DOCKER_USERNAME}" ]; then
  echo "❌ DOCKER_USERNAME is not set. Please set it before sourcing this script."
  return 1 2>/dev/null || exit 1
fi
export DOCKER_USERNAME

# Container Platform
export DOCKER_PLATFORM="linux/amd64"

# Services Configuration
export SERVICES=("ms-gateway" "ms-lie-detector" "ms-auditor" "auditmesh-frontend")

# Frontend Configuration
export FRONTEND_PORT="5173"

# Development Environment
export NODE_ENV="development"
export PYTHON_VERSION="3.11"

# Git Information
GIT_SHA_RAW="$(git rev-parse --short HEAD 2>/dev/null)"
if [[ "$GIT_SHA_RAW" =~ ^[0-9a-fA-F]{7,40}$ ]]; then
  export GIT_SHA="$GIT_SHA_RAW"
else
  export GIT_SHA="unknown"
fi
export GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Container Registry URLs
export REGISTRY="${DOCKER_REGISTRY}/$(echo ${DOCKER_NAMESPACE} | tr '[:upper:]' '[:lower:]')"

echo "✅ Environment variables loaded:"
echo "   GITHUB_ORG: ${GITHUB_ORG}"
echo "   GITHUB_REPO: ${GITHUB_REPO}"
echo "   DOCKER_REGISTRY: ${DOCKER_REGISTRY}"
echo "   DOCKER_NAMESPACE: ${DOCKER_NAMESPACE}"
echo "   GIT_SHA: ${GIT_SHA}"
echo "   GIT_BRANCH: ${GIT_BRANCH}"
echo "   REGISTRY: ${REGISTRY}"
