# Sistema de Gestión Integrado (SGI) - Kalciyan

Plataforma de búsqueda inteligente y asistente para documentación SGI, Training y Exámenes.

## Architecture
- **Frontend**: Next.js 14, Tailwind CSS (Cloud Run)
- **Backend**: FastAPI, LangChain, RAG (Cloud Run)
- **Database**: PostgreSQL + pgvector (Cloud SQL / Docker)
- **Storage**: Google Drive (Source of Truth)

## 🚀 Setup Local

1. **Prerequisitos**: Docker & Docker Compose.
2. **Variables de Entorno**:
   Crea un archivo `.env` en la raíz (ver `.env.example`).
   ```bash
   OPENAI_API_KEY=sk-...
   GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
   ```
3. **Credenciales**:
   Coloca tu `credentials.json` (Google Service Account) en la raíz.

4. **Iniciar**:
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Backend Docs: http://localhost:8000/docs

## ☁️ Deployment (Google Cloud Run)

El proyecto está configurado para despliegue automático vía GitHub Actions.

### 1. Inicialización (Una vez)
Ejecuta el script para crear repositorios y habilitar servicios:
```bash
./scripts/bootstrap_gcp.sh
```

### 2. Secretos en GitHub
Configura los siguientes Secrets en tu repositorio:
- `GCP_SA_KEY`: JSON completo de la Service Account con permisos de Cloud Run y Artifact Registry.
- `DATABASE_URL`: Connection string a tu Cloud SQL (Postgres).
- `OPENAI_API_KEY`: Tu key de OpenAI.

### 3. Deploy Automático
Al hacer push a la rama `main`, se ejecutará el pipeline:
1. Build de Docker images.
2. Push a Artifact Registry (`europe-west1`).
3. Deploy revisions a Cloud Run (`sgi-frontend` y `sgi-backend`).

### 4. Deploy Manual
Si prefieres hacerlo manualmente:
```bash
./scripts/deploy_manual.sh
```

## 🧠 Módulos
1. **Buscador (RAG)**: Indexa PDFs de GDrive y responde con evidencia citada.
2. **Training**: Rutas de aprendizaje por sector (Producción, Calidad, etc.).
3. **Examen**: Generación de preguntas multiple choice basadas en contexto.

## 📄 Licencia
Kalciyan Tecnología del Vidrio S.A. - Confidencial.
