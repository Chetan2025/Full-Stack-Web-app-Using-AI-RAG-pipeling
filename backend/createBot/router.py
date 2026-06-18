from typing import List

from fastapi import APIRouter, Depends, File, Request, BackgroundTasks, UploadFile
from sqlalchemy.orm import Session
from utilis import helper
from utilis.db import get_db
from user import schemas
from createBot import controller
from typing import List

create_router = APIRouter()

@create_router.post('/bot')
def create(files: List[UploadFile] = File(...),db : Session = Depends(get_db),request: Request=Depends(helper.is_authenticated)):
    return controller.create(files=files,db=db,request=request)