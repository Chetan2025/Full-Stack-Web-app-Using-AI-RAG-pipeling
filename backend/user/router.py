from fastapi import APIRouter, Depends, Request, BackgroundTasks
from sqlalchemy.orm import Session
from utilis.db import get_db
from user import schemas
from user import controller

user_router = APIRouter()


@user_router.post('/register', response_model=schemas.UserResponseSchema)
async def register_user(body: schemas.UserSchemaRegister, background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    return await controller.register(body, db, background_tasks)

@user_router.post('/login')
def login_user(body: schemas.UserSchemaLogin, db: Session = Depends(get_db)):
    return controller.login(body,db)

@user_router.get('/auth',response_model=schemas.UserResponseSchema)
def is_authticated(request: Request, db : Session = Depends(get_db)):
    return controller.is_auth(request, db)

