from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.training.generator import content_gen
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ExamRequest(BaseModel):
    category: str
    num_questions: int = 5

class TrainingRequest(BaseModel):
    department: str

@router.post("/exam/generate")
async def generate_exam(req: ExamRequest, db: AsyncSession = Depends(get_db)):
    questions = await content_gen.generate_exam(db, req.category, req.num_questions)
    return {"questions": questions}

@router.post("/training/routes")
async def get_training_routes(req: TrainingRequest, db: AsyncSession = Depends(get_db)):
    routes = await content_gen.get_training_routes(db, req.department)
    return {"routes": routes}
