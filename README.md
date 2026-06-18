# AI Document Chatbot SaaS Platform

A full-stack Retrieval-Augmented Generation (RAG) SaaS platform that enables users to create custom AI chatbots from their own documents and interact with them using unique API keys. The platform processes uploaded documents, stores semantic embeddings in a vector database, retrieves relevant context, and generates intelligent responses using Large Language Models.

---

## Overview

This project allows users to:

* Create custom AI chatbots
* Upload PDF, DOCX, and TXT documents
* Automatically generate embeddings from uploaded content
* Store vectors in PostgreSQL using pgvector
* Perform semantic similarity search
* Generate context-aware answers using Mistral/Ollama
* Access chatbot knowledge bases through API-key-based isolation

---

## Architecture

Frontend (HTML, CSS, JavaScript)

⬇

FastAPI Backend

⬇

Document Upload

⬇

Text Extraction Layer

(PDF / DOCX / TXT)

⬇

Text Chunking

⬇

Embedding Generation

(BAAI/bge-small-en-v1.5)

⬇

PostgreSQL + pgvector

⬇

Semantic Search

⬇

Retrieved Context

⬇

Mistral / Ollama LLM

⬇

Generated Answer

---

## Features

### Multi-Tenant Chatbot Platform

* Create multiple chatbots
* API-key-based chatbot isolation
* Independent document knowledge bases

### Document Processing

* PDF support
* DOCX support
* TXT support
* Automated text extraction pipeline

### Embedding Pipeline

* Semantic embedding generation using BAAI/bge-small-en-v1.5
* Efficient vector storage using pgvector
* High-performance retrieval workflows

### Retrieval-Augmented Generation (RAG)

* Context retrieval before answer generation
* Reduced hallucinations
* Document-grounded responses

### Semantic Search

* Cosine similarity vector search
* Top relevant chunk retrieval
* Context-aware answer generation

### Frontend Interface

* Responsive UI
* Chatbot creation dashboard
* Multi-file document upload
* Real-time upload previews
* Client-side validation

### REST APIs

* Chatbot creation
* Document upload
* Embedding generation
* Retrieval pipeline
* AI inference endpoints

---

## Tech Stack

### Backend

* FastAPI
* Python
* PostgreSQL
* pgvector

### AI & Machine Learning

* Sentence Transformers
* BAAI/bge-small-en-v1.5
* Ollama
* Mistral
* Retrieval-Augmented Generation (RAG)

### Frontend

* HTML
* CSS
* JavaScript

### Deployment

* Vercel
* Render

---

## Project Highlights

* Built a complete end-to-end RAG application from scratch.
* Implemented vector search using PostgreSQL and pgvector.
* Designed a scalable API-key-based multi-tenant architecture.
* Integrated semantic retrieval with LLM-powered response generation.
* Developed a production-ready document ingestion and chatbot workflow.
* Supported multiple document formats with automated processing.
* Deployed full-stack application using modern cloud deployment platforms.

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd project-folder
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=your_database_url
OLLAMA_BASE_URL=your_ollama_url
```

### Run Backend

```bash
uvicorn main:app --reload
```

### Run Frontend

Open the frontend folder and launch `index.html` using a browser or local server.

---

## Future Improvements

* User authentication and authorization
* Chat history persistence
* Team collaboration support
* Streaming responses
* Support for additional LLM providers
* Analytics dashboard
* Role-based access control

---

## Author

**Chetan**

AI Engineer | Full Stack Developer | RAG Systems Builder
