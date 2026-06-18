from fastapi import Request , HTTPException, Depends
from sqlalchemy.orm import Session 
from jose import jwt
from jose.exceptions import JWTError
from datetime import datetime
from utilis import settings
from user import models
from utilis.db import get_db 
import secrets


# --------------------------------
# genrate api key
# --------------------------------
def generate_api_key():
    return secrets.token_urlsafe(32)

# --------------------------------
# validate the user 
# --------------------------------
# this is the protected user where you can pass line db like dependencies injection use like this 
# it use like when the user do something in there login they can always check and verify 
def is_authenticated(request: Request, db : Session = Depends(get_db)):
    
    try:
        token = request.headers.get('Authorization')
        if not token:
            raise HTTPException(status_code=401, detail='you are unauthorized ')
        
        data = token.split(" ")[1]

        data = jwt.decode(data, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])

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
    

    
# --------------------------------
# send mail 
# --------------------------------
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig , MessageType
from pydantic import BaseModel, EmailStr



conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USER,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_USER,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Task Management App",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

async def send_email(email: list[str]):
    html = """
    <h2>Registration Successful 🎉</h2>

    <p>Hello,</p>

    <p>Your account has been successfully registered with  Management App.</p>

    <p>You can now sign in and start managing your tasks efficiently.</p>

    <p>Thank you for joining us.</p>

    <p>Best Regards,<br>
    Management Team</p>
    """

    message = MessageSchema(
        subject="Registration Confirmation",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "email has been sent"}


