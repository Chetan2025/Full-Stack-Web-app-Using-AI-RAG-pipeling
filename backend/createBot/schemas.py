from pydantic import BaseModel


class ChatBotResponse(BaseModel):
    id: int
    user_id: int
    chatbot_name: str
    api_key: str

