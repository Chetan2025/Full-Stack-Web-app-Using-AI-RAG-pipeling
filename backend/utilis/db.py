from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from utilis import settings

DB_URL = settings.DB_URL


#create the engine that help 

engine = create_engine(DB_URL)  # make the connection to db

Base = declarative_base()  # use orm model to inheritent the tables, data 

SessionLocal = sessionmaker(  # this run the quary like update , delete, add
    autocommit=False,
    autoflush=False,
    bind=engine 
)

def get_db(): # this is for the dependency injection 
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
