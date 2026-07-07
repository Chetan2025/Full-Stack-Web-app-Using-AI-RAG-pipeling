# python -m uvicorn main:app --reload

from email.mime import base
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from utilis.db import  engine
from user.router import user_router
from utilis.db import Base
from createBot.router import create_router
from askque.router import ask_router
from utilis.modelLoad import model
from ollama import chat

app = FastAPI()

Base.metadata.create_all(bind=engine)
# UserModel.metadata.create_all(bind=engine)


@app.get("/")
def health_check():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router,prefix='/user')
app.include_router(create_router,prefix='/create')
app.include_router(ask_router,prefix='/chat')

import os
import psutil

process = psutil.Process(os.getpid())
print(f"Final RAM: {process.memory_info().rss / 1024**2:.2f} MB")