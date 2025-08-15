#!/bin/bash

# GitHub Configuration
export GITHUB_ORG="Neiland85-Org"
export GITHUB_REPO="auditmesh"
export GITHUB_TOKEN="$(gh auth token)"

# Docker Registry Configuration
export DOCKER_REGISTRY="ghcr.io"
export DOCKER_NAMESPACE="${GITHUB_ORG}"
export DOCKER_USERNAME="$(gh api user --jq .login)"

# Container Platform
export DOCKER_PLATFORM="linux/amd64"

# Services Configuration
export SERVICES=("ms-gateway" "ms-lie-detector" "ms-auditor")

# Development Environment
export NODE_ENV="development"
export PYTHON_VERSION="3.11"

# Git Information
export GIT_SHA="$(git rev-parse --short HEAD)"
export GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# Container Registry URLs
export REGISTRY="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}"

echo "✅ Environment variables loaded:"
echo "   GITHUB_ORG: ${GITHUB_ORG}"
echo "   GITHUB_REPO: ${GITHUB_REPO}"
echo "   DOCKER_REGISTRY: ${DOCKER_REGISTRY}"
echo "   DOCKER_NAMESPACE: ${DOCKER_NAMESPACE}"
echo "   GIT_SHA: ${GIT_SHA}"
echo "   GIT_BRANCH: ${GIT_BRANCH}"
echo "   REGISTRY: ${REGISTRY}"
