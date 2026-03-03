import bcrypt
import base64
from fastapi import HTTPException
from app.models.cuenta import Cuenta
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.core.security import get_current_user


@staticmethod
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return base64.b64encode(hashed_password).decode('utf-8')

@staticmethod
def verify_password(plain_password: str, hashed_password_str: str) -> bool:
    hashed_password = base64.b64decode(hashed_password_str.encode('utf-8'))
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
