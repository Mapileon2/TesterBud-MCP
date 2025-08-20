#!/bin/bash

# Script for deploying using Docker

# Ensure Docker is running
if ! command -v docker &> /dev/null
then
    echo "Docker could not be found. Please ensure Docker is installed and running."
    exit 1
fi

SERVICE_NAME="TesterBud"
IMAGE_NAME="${SERVICE_NAME}:latest" # Or use a version tag

echo "Building Docker image for $SERVICE_NAME..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo "Docker image build failed. Please check the output above."
    exit 1
fi

echo "Docker image built successfully: $IMAGE_NAME"

echo "Running Docker container..."
# Use docker-compose up -d for detached mode if you have docker-compose.yml configured
# For a simple run, we can use docker run directly.
# Ensure you have a .env file with GEMINI_API_KEY or pass it via -e flag.
# Example: docker run -d -p 3000:3000 --name $SERVICE_NAME -e GEMINI_API_KEY=$GEMINI_API_KEY $IMAGE_NAME

# Using docker-compose for a more robust setup
if [ -f "docker-compose.yml" ]; then
    echo "Using docker-compose.yml to run the service..."
    docker-compose up -d
    if [ $? -ne 0 ]; then
        echo "Docker Compose up failed. Please check the output above."
        exit 1
    fi
    echo "Service started using Docker Compose."
else
    echo "docker-compose.yml not found. Starting container directly."
    # Fallback to docker run if docker-compose.yml is not present
    # Ensure GEMINI_API_KEY is set in your environment or passed here
    if [ -z "$GEMINI_API_KEY" ]; then
        echo "Warning: GEMINI_API_KEY is not set. LLM functionality might be impaired."
    fi
    docker run -d -p 3000:3000 --name $SERVICE_NAME -e GEMINI_API_KEY=$GEMINI_API_KEY $IMAGE_NAME
    if [ $? -ne 0 ]; then
        echo "Docker run failed. Please check the output above."
        exit 1
    fi
    echo "Service started in detached mode with container name: $SERVICE_NAME"
fi

echo "Deployment via Docker complete."
