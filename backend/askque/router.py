from fastapi import APIRouter, Depends, File, Request, BackgroundTasks, UploadFile
from sqlalchemy.orm import Session
from askque import controller
from askque import schemas
from utilis import helper
from utilis.db import get_db


ask_router = APIRouter()

@ask_router.post('/ask')
def ask(body:schemas.QuerySchema, db: Session = Depends(get_db)):
    return controller.ask(body, db)