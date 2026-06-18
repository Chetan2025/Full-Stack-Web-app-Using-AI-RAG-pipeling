from langchain_text_splitters import RecursiveCharacterTextSplitter

def create_chunks(text: str):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    )

    chunks = splitter.split_text(text)
    print(chunks)
    print(f"Number of chunks created: {len(chunks)}")
    print(type(chunks))
    return chunks