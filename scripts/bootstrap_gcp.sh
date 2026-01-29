#!/bin/bash
# script to bootstrap GCP resources

PROJECT_ID="kalciyan-790541980068"
REGION="europe-west1"
REPO_NAME="sgi-repo"

echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Enabling Services..."
gcloud services enable run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    drive.googleapis.com

echo "Creating Artifact Registry Repo..."
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for SGI"

echo "Success! Resources created."
