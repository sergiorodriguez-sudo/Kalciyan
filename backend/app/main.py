from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "online"}


