#!/bin/bash
# Manual deploy script

PROJECT_ID="kalciyan-790541980068"
REGION="europe-west1"
REPO_NAME="sgi-repo"

echo "Building Backend..."
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-backend:latest ./backend
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-backend:latest

echo "Building Frontend..."
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-frontend:latest ./frontend
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-frontend:latest

echo "Deploying Backend to Cloud Run..."
gcloud run deploy sgi-backend \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-backend:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="DATABASE_URL=postgres://...,OPENAI_API_KEY=..."

echo "Deploying Frontend to Cloud Run..."
gcloud run deploy sgi-frontend \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/sgi-frontend:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="NEXT_PUBLIC_API_URL=https://sgi-backend-xyz.run.app"

echo "Done!"
