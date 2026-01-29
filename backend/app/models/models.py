from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.dialects.postgresql import ARRAY
from pgvector.sqlalchemy import Vector
from datetime import datetime
from app.db.session import Base
from app.core.config import settings

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True)  # Google Drive File ID
    name = Column(String, nullable=False)
    mime_type = Column(String)
    drive_url = Column(String)
    folder_path = Column(String)  # e.g., "Kalciyan/SGI/Calidad"
    last_modified = Column(DateTime)
    indexed_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Chunk(Base):
    __tablename__ = "chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    content = Column(Text, nullable=False)
    
    # Metadata for citation
    page_number = Column(Integer, nullable=True)
    section_heading = Column(String, nullable=True)
    chunk_index = Column(Integer)
    
    # Vector embedding
    embedding = Column(Vector(settings.VECTOR_DIM))

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="viewer")  # admin, quality, safety, production, viewer

class ExamQuestion(Base):
    __tablename__ = "exam_questions"
    
    id = Column(Integer, primary_key=True)
    question_text = Column(String)
    options = Column(JSON)  # List of strings
    correct_option_index = Column(Integer)
    explanation = Column(Text)
    evidence_chunk_id = Column(Integer, ForeignKey("chunks.id")) # Backing evidence
    category = Column(String) # Safety, Quality, etc.

class TrainingRoute(Base):
    __tablename__ = "training_routes"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False) # e.g. "Inducción Calidad"
    department = Column(String) # Producción, Calidad, etc.
    description = Column(String)

class TrainingStep(Base):
    __tablename__ = "training_steps"
    
    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("training_routes.id"))
    order = Column(Integer)
    title = Column(String)
    content_summary = Column(Text)
    evidence_chunk_id = Column(Integer, ForeignKey("chunks.id"))
