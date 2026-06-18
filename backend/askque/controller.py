from createBot.models import ChatBotModel, DocumentChunkModel
from utilis import settings
from utilis.modelLoad import model 
from sqlalchemy import text
import requests
import time


def ask(body, db):
    # Validate chatbot by API key
    chatbot = db.query(ChatBotModel).filter(ChatBotModel.api_key == body.api_key).first()
    if not chatbot:
        return {"message": "Invalid API Key"}
    
    chatbot.usage_count += 1
    db.commit() 

    # Encode question
 
    question_embedding = model.encode(body.question, normalize_embeddings=True)
    embedding_str = str(question_embedding.tolist())

    # Fetch top chunks by similarity
    results = db.execute(
        text("""
            SELECT chunk_text
            FROM document_chunks
            WHERE chatbot_id = :chatbot_id
            ORDER BY embedding <=> :embedding
            LIMIT 2
        """),
        {"chatbot_id": chatbot.id, "embedding": embedding_str}
    )

    context = "\n\n".join([row.chunk_text for row in results])

    #  Build prompt
    prompt = f"""
You are a helpful assistant.

Answer ONLY using the provided context.

If the answer is not in the context, say:
"I could not find that information."

Context:
{context[:1500]}

Question:
{body.question}

Answer:
"""
    return generate_answer(prompt)


def generate_answer(prompt: str):
    url = "https://open-ai21.p.rapidapi.com/conversationllama"
    headers = {
        "Content-Type": "application/json",
        "x-rapidapi-host": "open-ai21.p.rapidapi.com",
        "x-rapidapi-key": settings.ModelRAPID_API_KEY
    }
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "web_access": False
    }

    try:
        start = time.time()
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        elapsed = time.time() - start

        if response.ok:
            data = response.json()
            answer = (
                data.get("message", {}).get("content")
                or data.get("result")
                or data.get("output")
                or "No answer found."
            )
            return {"answer": answer, "time_taken": f"{elapsed:.2f} seconds"}
        else:
            return {"error": f"Request failed ({response.status_code})", "details": response.text}

    except requests.exceptions.RequestException as e:
        return {"error": f"LLM Request Error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected Error: {str(e)}"}
