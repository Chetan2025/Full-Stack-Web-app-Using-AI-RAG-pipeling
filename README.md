# Full-Stack RAG Chatbot

A full-stack Retrieval-Augmented Generation (RAG) application that turns uploaded documents into searchable knowledge for custom AI chatbots. Users can create chatbots, upload documents (PDF/DOCX/TXT), and query the chatbot using an API key. The project combines a FastAPI backend, vector storage (Postgres + pgvector), embedding generation, and a lightweight HTML/JS frontend.

## Key Features

- Document ingestion: upload PDF, DOCX, and TXT files
- Text extraction and chunking with configurable overlap
- Embedding generation and storage in PostgreSQL + pgvector
- Semantic search (cosine similarity) to retrieve relevant chunks
- RAG pipeline that provides context-aware answers using LLMs
- API-key based multi-tenant design (each chatbot has its own data)
- Simple frontend for creating and managing chatbots

## Architecture Overview

- Frontend: static HTML, CSS, JavaScript for user flows and uploads
- Backend: FastAPI endpoints for auth, document processing, embeddings, and inference
- Storage: PostgreSQL database with `pgvector` extension for vector search
- Models: Embedding model and an LLM layer (configured via environment)

## Repository Layout

- `backend/` — FastAPI app, document pipeline, and API routes
- `frontend/` — HTML/CSS/JS client (dashboard, login, upload pages)
- `createBot/`, `askque/`, `user/` — backend modules for bot management, QA, and users
- `utilis/` — utility modules: `db.py`, `helper.py`, `modelLoad.py`, `settings.py`

## Prerequisites

- Python 3.10+
- PostgreSQL (with `pgvector` extension)
- (Optional) An LLM/Embedding provider or local LLM service

## Quick Start (Backend)

1. Create and activate a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies

```powershell
pip install -r backend/requirements.txt
```

3. Set environment variables (example `.env` entries)

```
DB_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
ALGORITHM=HS256
ModelRAPID_API_KEY=your_model_api_key
MAIL_USER=your_email_user
MAIL_PASSWORD=your_email_password
MAIL_API_KEY=your_email_api_key
```

4. Run the FastAPI server

```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` and documentation at `http://localhost:8000/docs`.

## Frontend

The frontend is static files in the `frontend/` folder. You can serve them from any static hosting (Vercel, Netlify) or open `frontend/dashboard.html` locally for basic testing.

## API Usage Example

POST to the QA endpoint (example body):

```json
{ "api_key": "CHATBOT_API_KEY", "question": "What is the purpose of X?" }
```

Check `backend` routes for exact endpoint paths and request/response schemas.

## Environment & Configuration

Configuration variables are loaded from environment variables and `.env` via `backend/utilis/settings.py`. At minimum you should configure database connection and any model/LLM API keys required by your inference pipeline.

## Deployments

- Frontend: can be deployed as static hosting (Vercel, Netlify)
- Backend: compatible with Render, Heroku, or any server that supports FastAPI
- Ensure PostgreSQL is accessible and `pgvector` is enabled in production DB

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests with clear descriptions.

## License

This repository includes a `LICENSE` file. Please follow its terms when using or contributing to the project.

---

If you want, I can also:

- Add example `.env` and `.env.example` files
- Add a small `docker-compose.yml` to run Postgres + backend locally
- Update the README with exact API endpoints and example curl commands after I inspect the backend routes

Tell me which option you prefer and I will proceed.
