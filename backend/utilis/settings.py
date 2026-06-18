from dotenv import load_dotenv
import os

load_dotenv()

# gentrate token
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# DataBase URL
DB_URL = os.getenv("DB_URL")

# email sending
MAIL_USER=os.getenv("MAIL_USER")
MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")

MAIL_URL = os.getenv("Email_API_URL")
MAIL_API_KEY = os.getenv("Email_API_KEY")

ModelRAPID_API_KEY = os.getenv("ModelRAPID_API_KEY")