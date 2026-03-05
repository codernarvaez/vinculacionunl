from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional

class administrador_request(BaseModel):
    nombres: str = Field(..., max_length=100, min_length=2)
    apellidos: str = Field(..., max_length=100, min_length=2)
    correo: EmailStr
    clave: str= Field(..., max_length=15, min_length=8)

class administrador_response(BaseModel):
    uuid: str
    nombres: str
    apellidos: str

    model_config = ConfigDict(from_attributes=True)