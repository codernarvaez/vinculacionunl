from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional
from uuid import UUID
from datetime import date
from ..models.participante import TipoGenero
from fastapi import UploadFile, File


class participante_request(BaseModel):
    nombres: str = Field(..., max_length=100, min_length=2)
    apellidos: str = Field(..., max_length=100, min_length=2)
    cedula: str = Field(..., max_length=20, min_length=5)
    fechaNac: date
    genero: TipoGenero
    condicionMedica: Optional[str] = Field(None, max_length=255)
    foto: UploadFile = File(...)
    acepto_terminos: bool
    representante_uuid: UUID = Field(...)
    escuela_uuid: UUID = Field(...)


class participante_response(BaseModel):
    uuid: str
    nombres: str
    apellidos: str
    cedula: str
    fechaNac: date
    genero: TipoGenero
    condicionMedica: Optional[str]
    foto: Optional[str]
    acepto_terminos: bool

    model_config = ConfigDict(from_attributes=True)