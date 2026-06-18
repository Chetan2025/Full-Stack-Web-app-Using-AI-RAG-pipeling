from pydantic import BaseModel

class QuerySchema(BaseModel):
    api_key: str
    question: str