from pydantic import BaseModel


class ChatBotResponseHome(BaseModel):
    id: int
    user_id: int
    chatbot_name: str
    api_key: str
    usage_count: int

