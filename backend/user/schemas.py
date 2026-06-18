from pydantic import BaseModel

class UserSchemaRegister(BaseModel):
    username: str
    email: str
    password: str


class UserResponseSchema(BaseModel):
    id: int
    username: str
    email: str

class UserSchemaLogin(BaseModel):
    username: str
    password: str
    