from sqlalchemy.orm import Session
from createBot import models

def get_bot(db: Session, request):

    user_id = request.id

    bot = db.query(models.ChatBotModel).filter(
        models.ChatBotModel.user_id == user_id
    ).all()

    return bot

def delete_bot(id, db: Session, request):

    user_id = request.id

    bot = db.query(models.ChatBotModel).filter(
        models.ChatBotModel.id == id,
        models.ChatBotModel.user_id == user_id
    ).first()

    if not bot:
        return {"message": "Bot not found"}

    # Is chatbot ke saare chunks + embeddings delete
    db.query(models.DocumentChunkModel).filter(
        models.DocumentChunkModel.chatbot_id == bot.id
    ).delete(synchronize_session=False)

    # Chatbot delete
    db.delete(bot)

    db.commit()

    return {
        "message": "Chatbot deleted successfully",
        "chatbot_id": id
    }

