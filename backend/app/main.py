from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello form Cloud Run! Deployment Successful."}


