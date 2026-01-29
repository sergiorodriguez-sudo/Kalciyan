from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Chunk, Document
from app.core.config import settings
from langchain_openai import OpenAIEmbeddings
import openai

class RAGEngine:
    def __init__(self):
        # We need an API key for embeddings
        if settings.OPENAI_API_KEY:
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=settings.OPENAI_API_KEY,
                model="text-embedding-ada-002"
            )
            self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            print("WARNING: No OpenAI API Key found.")
            self.embeddings = None
            self.client = None

    async def search(self, db: AsyncSession, query: str, limit: int = 5) -> list[Chunk]:
        """
        Semantic search using pgvector.
        """
        if not self.embeddings:
            return []

        query_vector = await self.embeddings.aembed_query(query)
        
        # PGVector L2 distance search (ordering by distance ascending)
        # Note: formatting might vary depending on pgvector version usage in SQLAlchemy
        stmt = select(Chunk).order_by(Chunk.embedding.l2_distance(query_vector)).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def generate_answer(self, query: str, chunks: list[Chunk]) -> dict:
        """
        Generates answer using LLM with strictly grounded context.
        """
        if not self.client:
            return {"answer": "Error: OpenAI client not initialized.", "evidence": []}

        if not chunks:
            return {
                "answer": "No encuentro respaldo en el SGI para responder esta consulta. Sugiero buscar en la carpeta 'Manuales/General'.",
                "evidence": []
            }

        context_text = ""
        evidence_list = []
        
        for i, chunk in enumerate(chunks):
            # We assume eager loading or we fetch doc name separately, for now simplified
            doc_info = f"DocID: {chunk.document_id}, Page: {chunk.page_number}" 
            context_text += f"[{i+1}] {chunk.content} (Source: {doc_info})\n\n"
            evidence_list.append({
                "chunk_id": chunk.id,
                "text": chunk.content,
                "doc_id": chunk.document_id,
                "page": chunk.page_number
            })

        system_prompt = (
            "Actuá como el sistema SGI de Kalciyan. "
            "Tu objetivo es responder preguntas basándote ÚNICAMENTE en el contexto proporcionado. "
            "Si la información no está en el contexto, decí 'No encuentro respaldo en el SGI'. "
            "CITA las fuentes usando [1], [2], etc."
        )

        user_prompt = f"Contexto:\n{context_text}\n\nPregunta: {query}"

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4", # Or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0
            )
            answer = response.choices[0].message.content
            return {"answer": answer, "evidence": evidence_list}
            
        except Exception as e:
            return {"answer": f"Error generando respuesta: {e}", "evidence": []}

rag_engine = RAGEngine()
