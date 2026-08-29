from fastapi import APIRouter, Depends, File, Request, BackgroundTasks, UploadFile
from sqlalchemy.orm import Session
from operation import controller
from operation import schemas
from utilis import helper
from utilis.db import get_db


op_router = APIRouter()


@op_router.get('/get_chatbot', response_model=list[schemas.ChatBotResponseHome])
def create(db : Session = Depends(get_db),request: Request=Depends(helper.is_authenticated)):
    return controller.get_bot(db=db,request=request)


@op_router.delete('/deletebot/{id}')
def create(id,db : Session = Depends(get_db),request: Request=Depends(helper.is_authenticated)):
    return controller.delete_bot(id,db=db,request=request)
