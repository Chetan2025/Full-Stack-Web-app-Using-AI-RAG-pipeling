from utilis.modelLoad import model

def create_embeddings(chunks):
  

    embeddings = model.encode(
        chunks,
        normalize_embeddings=True
    )

    return embeddings