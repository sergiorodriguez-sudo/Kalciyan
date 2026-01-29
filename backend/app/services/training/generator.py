from app.models.models import ExamQuestion, TrainingRoute, TrainingStep
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import random

class ContentGenerator:
    """
    Simulates generation of Training content and Exams from SGI docs.
    In a real scenario, this would use RAG to extract 'procedures' and turn them into steps/questions.
    """
    
    async def generate_exam(self, db: AsyncSession, category: str, limit: int = 5) -> list[dict]:
        # Mock generation based on category
        # In real life: query Vector DB for category -> Ask LLM to generate Multiple Choice
        
        mock_questions = [
            {
                "question_text": f"¿Cuál es el EPP obligatorio para {category}?",
                "options": ["Casco y gafas", "Solo guantes", "Ropa de calle", "Ninguno"],
                "correct_option_index": 0,
                "explanation": "Según el manual de seguridad, casco y gafas son obligatorios en planta.",
                "evidence_chunk_id": None # Would link to actual chunk
            },
            {
                "question_text": f"En caso de emergencia en {category}, ¿qué se debe hacer?",
                "options": ["Correr", "Gritar", "Seguir procedimiento de evacuación", "Ignorar alarma"],
                "correct_option_index": 2,
                "explanation": "El procedimiento de evacuación define las rutas de salida.",
                "evidence_chunk_id": None
            }
        ]
        
        # Multiply to reach limit
        return (mock_questions * 3)[:limit]

    async def get_training_routes(self, db: AsyncSession, department: str) -> list[dict]:
        # Return mock routes
        return [
            {
                "id": 1,
                "title": f"Inducción Básica - {department}",
                "department": department,
                "description": "Conceptos fundamentales y normas de convivencia.",
                "steps": [
                    {"order": 1, "title": "Introducción", "content": "Bienvenido al área..."},
                    {"order": 2, "title": "Seguridad", "content": "Normas de seguridad específicas..."}
                ]
            },
            {
                "id": 2,
                "title": f"Procedimientos Operativos - {department}",
                "department": department,
                "description": "Cómo operar la maquinaria y reportar fallas.",
                "steps": [
                    {"order": 1, "title": "Encendido", "content": "Verificar conexiones..."},
                    {"order": 2, "title": "Operación", "content": "Mantener distancia..."}
                ]
            }
        ]

content_gen = ContentGenerator()
