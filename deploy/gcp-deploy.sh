#!/bin/bash

# Script for deploying to Google Cloud Platform (GCP)

# Ensure you have authenticated with GCP: gcloud auth login
# Set your GCP project: gcloud config set project YOUR_PROJECT_ID

PROJECT_ID="your-gcp-project-id" # Replace with your GCP Project ID
SERVICE_NAME="TesterBud"
REGION="us-central1" # Example GCP region
DOCKER_IMAGE_NAME="${SERVICE_NAME}:${npm_package_version:-latest}" # Use package version or 'latest'

echo "Deploying to GCP service: $SERVICE_NAME in project: $PROJECT_ID"

# 1. Build the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_IMAGE_NAME .

# 2. Tag the Docker image for Google Container Registry (GCR) or Artifact Registry
# Using Artifact Registry is recommended
# Replace 'your-gcr-or-artifact-registry' with your registry path
GCP_REGISTRY="gcr.io/$(gcloud config get-value project)" # Or your Artifact Registry path
TAGGED_IMAGE_NAME="${GCP_REGISTRY}/${SERVICE_NAME}:${npm_package_version:-latest}"
docker tag $DOCKER_IMAGE_NAME $TAGGED_IMAGE_NAME
echo "Tagged Docker image as: $TAGGED_IMAGE_NAME"

# 3. Push the Docker image to GCR or Artifact Registry
echo "Pushing Docker image to GCP registry..."
docker push $TAGGED_REGISTRY
echo "Docker image pushed successfully."

# 4. Deploy to Google Cloud Run (or GKE, App Engine, etc.)
# This example uses Cloud Run for simplicity.
# You might need to create a Cloud Run service definition or use gcloud commands.

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image=$TAGGED_IMAGE_NAME \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=production,GEMINI_API_KEY=$GEMINI_API_KEY \
  --project=$PROJECT_ID

echo "Deployment to Cloud Run initiated. Monitor status in GCP console."

# Note: You might need to configure environment variables like GEMINI_API_KEY
# either directly in the command or via GCP Secret Manager.
# For production, consider using a more robust deployment strategy.
