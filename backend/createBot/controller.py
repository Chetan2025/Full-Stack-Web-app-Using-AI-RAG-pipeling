from typing import List
from fastapi import File, HTTPException, UploadFile
from createBot.RAGpipeline import extractText
from createBot.RAGpipeline import create_chunksunks 
from createBot.RAGpipeline import embedings 

from utilis.helper import generate_api_key


from sqlalchemy.orm import Session

from typing import List
from fastapi import UploadFile
from sqlalchemy.orm import Session

from createBot.RAGpipeline import extractText, create_chunksunks, embedings
from utilis.helper import generate_api_key
from createBot.models import ChatBotModel, DocumentChunkModel


def create(files: List[UploadFile], db: Session,request):
    # Extract text from uploaded files
    text = extractText.extract_text(files)

    # Create chunks and embeddings
    chunks = create_chunksunks.create_chunks(text)
    embeddings = embedings.create_embeddings(chunks)

    # Generate API key and save chatbot
    chatbot = ChatBotModel(
        user_id=request.id,
        chatbot_name="My Chatbot",
        api_key=generate_api_key(),
        usage_count=0
    )
    db.add(chatbot)
    db.commit()
    db.refresh(chatbot)


    for chunk, embedding in zip(chunks, embeddings):
        chunk_row = DocumentChunkModel(
            chatbot_id=chatbot.id,
            chunk_text=chunk,
            embedding=embedding.tolist()
        )
        db.add(chunk_row)
    db.commit()


    # Return response
    return {
        "chatbot_id": chatbot.id,
        "api_key": chatbot.api_key,
        "chunks": len(chunks)
    }

