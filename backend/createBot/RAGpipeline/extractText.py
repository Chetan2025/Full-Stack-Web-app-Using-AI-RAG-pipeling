from pypdf import PdfReader
from docx import Document
from io import BytesIO
from typing import List
from fastapi import UploadFile

def extract_text(files: List[UploadFile]):
    all_text = ""   # local variable rakho, global mat banao

    for file in files:
        content = file.file.read()

        if file.filename.endswith(".pdf"):
            pdf = PdfReader(BytesIO(content))
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text += text + "\n"

        elif file.filename.endswith(".docx"):
            doc = Document(BytesIO(content))
            for para in doc.paragraphs:
                all_text += para.text + "\n"

        elif file.filename.endswith(".txt"):
            all_text += content.decode("utf-8") + "\n"

    return all_text
