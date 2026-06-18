from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from utilis import settings

DB_URL = settings.DB_URL


#create the engine that help 

engine = create_engine(DB_URL)

Base = declarative_base()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine 
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
