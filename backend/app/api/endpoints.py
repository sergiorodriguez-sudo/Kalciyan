from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.rag.engine import rag_engine
from app.services.drive.connector import drive_service
from app.services.rag.extraction import extractor
from app.services.rag.chunking import chunker
from pydantic import BaseModel

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    evidence: list[dict]

@router.post("/query", response_model=QueryResponse)
async def query_sgi(request: QueryRequest, db: AsyncSession = Depends(get_db)):
    """
    Search SGI and generate answer.
    """
    # 1. Search relevant chunks
    chunks = await rag_engine.search(db, request.query)
    
    # 2. Generate answer
    result = await rag_engine.generate_answer(request.query, chunks)
    
    return result

@router.post("/index")
async def trigger_indexing(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """
    Trigger background indexing of Google Drive.
    """
    # In a real app, we'd pass the session properly or use a separate worker
    # background_tasks.add_task(run_indexing_process, db)
    return {"status": "Indexing started (Mock)"}

# TODO: Implement actual background indexing function
# async def run_indexing_process(db: AsyncSession):
#     files = drive_service.list_files().get('files', [])
#     for file in files:
#         # Download, Extract, Chunk, Embed, Save to DB
#         pass
