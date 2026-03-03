from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional

class representante_request(BaseModel):
    nombres: str = Field(..., max_length=100, min_length=2)
    apellidos: str = Field(..., max_length=100, min_length=2)
    contacto: str = Field(..., max_length=100)
    domicilio: str = Field(..., max_length=150)
    acepto_terminos: bool
    correo: EmailStr
    clave: str
    cedula: str = Field(..., max_length=12, min_length=10)


class RepresentanteResponse(BaseModel):
    nombres: str
    apellidos: str
    cedula: str
    contacto: str
    domicilio: str
    
    model_config = ConfigDict(from_attributes=True)