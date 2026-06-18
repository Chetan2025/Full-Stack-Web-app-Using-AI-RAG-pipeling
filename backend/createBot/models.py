from sqlalchemy import Column, Integer, String, ForeignKey
from pgvector.sqlalchemy import Vector
from utilis.db import Base

class ChatBotModel(Base):
    __tablename__ = "chatbots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chatbot_name = Column(String(100), nullable=False)
    api_key = Column(String(255), unique=True, nullable=False)
    usage_count = Column(Integer, index=True)




class DocumentChunkModel(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id", ondelete="CASCADE"), nullable=False)
    chunk_text = Column(String, nullable=False)
    embedding = Column(Vector(384), nullable=False)
