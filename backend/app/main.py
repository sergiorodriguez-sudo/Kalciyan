from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints, endpoints_training
from app.core import config
import uvicorn
import os

app = FastAPI(title="SGI Kalciyan API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(endpoints.router, prefix="/api/v1", tags=["General"])
app.include_router(endpoints_training.router, prefix="/api/v1/training", tags=["Training"])

@app.get("/")
def health_check():
    return {"status": "online"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)


