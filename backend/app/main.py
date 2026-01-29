from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from app.core.config import settings
from app.db.session import engine, Base

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost",
    "https://kalciyan-790541980068.europe-west1.run.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Helper to init DB tables (MVP only - use Alembic in prod)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "SGI Backend"}

@app.get("/")
def root():
    return {"message": "Welcome to SGI API"}

# Include routers here when created
from app.api import endpoints, endpoints_training
app.include_router(endpoints.router, prefix=settings.API_V1_STR)
app.include_router(endpoints_training.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)

