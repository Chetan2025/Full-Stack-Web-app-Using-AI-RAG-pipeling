from fastapi import Request,BackgroundTasks
from sqlalchemy.orm import Session
from user import models
from pwdlib import PasswordHash
from fastapi import HTTPException
from jose import jwt 
from jose.exceptions import JWTError
from datetime import datetime, timedelta
from utilis import settings
from utilis.helper import  send_email

password_hash = PasswordHash.recommended()
JWT_SECRET = settings.JWT_SECRET
ALGORITHM = settings.ALGORITHM

def get_password_hash(password):
    return password_hash.hash(password)

async def register(body, db : Session, background_tasks: BackgroundTasks):
    

    is_user = db.query(models.UserModel).filter(models.UserModel.username == body.username).first()
    if is_user:
            raise HTTPException(status_code=400, detail='Username already exists')
    
    is_user = db.query(models.UserModel).filter(models.UserModel.email == body.email).first()
    if is_user:
        raise HTTPException(status_code=400, detail='Email already exists')

    hash_password = get_password_hash(body.password)

    new_user = models.UserModel(
        username = body.username,
        email = body.email,
        hashed_password = hash_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    #send email conformation 
    background_tasks.add_task(send_email, body.email)
    return new_user


def login(body, db : Session):
    is_user = db.query(models.UserModel).filter(models.UserModel.username == body.username).first()
    if not is_user:
        raise HTTPException(status_code=400, detail='Invalid username or password')
    
    if not password_hash.verify(body.password, is_user.hashed_password):
        raise HTTPException(status_code=400, detail='Invalid username or password.')
    
    EXP_Time = datetime.now() + timedelta(minutes=30)

    token = jwt.encode({"user_id": is_user.id, "exp": EXP_Time.timestamp()}, JWT_SECRET, algorithm=ALGORITHM)

    return {"access_token": token}


def is_auth(request: Request, db : Session):
    
    try:
        token = request.headers.get('Authorization')
        if not token:
            raise HTTPException(status_code=401, detail='you are unauthorized ')
        
        data = token.split(" ")[1]

        data = jwt.decode(data, JWT_SECRET, algorithms=[ALGORITHM])

        user_id = data.get("user_id")
        exp_time = data.get("exp")

        current_time = datetime.now().timestamp()
        if exp_time < current_time:
            raise HTTPException(status_code=401, detail='Token has expired')

        user = db.query(models.UserModel).filter(models.UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail='Invalid token')
        
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail='you are unauthorized')