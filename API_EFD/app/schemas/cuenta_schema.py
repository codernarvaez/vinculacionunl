from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class login_request(BaseModel):
    correo: EmailStr
    clave: str


class login_response(BaseModel):
    uuid: Optional[str] = None
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    rol: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"

    model_config = ConfigDict(from_attributes=True)

class token_data(BaseModel):
    id: Optional[str] = None

class auth_Schema:
    pass