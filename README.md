# Full-Stack-Web-app-Using-AI-RAG-pipeling
Frontend (HTML + CSS + JS)
            │
            ▼
     FastAPI Backend
            │
            ▼
      Document Upload
            │
            ▼
    Text Extraction Layer
(PDF / DOCX / TXT Support)
            │
            ▼
         Chunking
            │
            ▼
  Embedding Generation
            │
            ▼
 PostgreSQL + pgvector
            │
            ▼
      Semantic Search
            │
            ▼
     Retrieved Context
            │
            ▼
    Mistral / LLM Layer
            │
            ▼
      Generated Answer
      
AI Document Chatbot SaaS Platform | FastAPI · PostgreSQL · pgvector · BGE Embeddings · RAG · Mistral/Ollama · HTML · CSS · JavaScript

Built a full-stack Retrieval-Augmented Generation (RAG) platform that allows users to create custom AI chatbots from their own documents and interact with them through unique API keys.

• Developed a FastAPI backend supporting document ingestion, text extraction, chunking, embedding generation, vector search, and AI-powered question answering.

• Implemented document processing pipeline for PDF, DOCX, and TXT files using Recursive Character Text Splitting with configurable chunk overlap.

• Generated semantic embeddings using BAAI/bge-small-en-v1.5 and stored vectors in PostgreSQL with pgvector for efficient similarity search.

• Designed API-key-based multi-tenant architecture enabling each chatbot to retrieve responses exclusively from its own document knowledge base.

• Built a Retrieval-Augmented Generation (RAG) pipeline combining semantic search and Large Language Models to provide context-aware answers.

• Implemented cosine similarity vector search to retrieve the most relevant document chunks before answer generation.

• Developed REST APIs for chatbot creation, document upload, embedding storage, retrieval, and inference workflows.

• Created a responsive frontend using HTML, CSS, and JavaScript for chatbot creation, multi-file document uploads, and chatbot management.

• Added client-side validation supporting up to 3 document uploads with file size restrictions and real-time document previews.

• Deployed frontend on Vercel and backend services on Render with PostgreSQL database integration.

Tech Stack: FastAPI, Python, PostgreSQL, pgvector, Sentence Transformers, BGE Embeddings, Ollama, Mistral, HTML, CSS, JavaScript, Vercel, Render.
