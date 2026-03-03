from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class login_request(BaseModel):
    correo: EmailStr
    clave: str


class login_response(BaseModel):
    uuid: Optional[str] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    rol: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"

    model_config = ConfigDict(from_attributes=True)

class token_data(BaseModel):
    id: Optional[str] = None

class auth_Schema:
    pass