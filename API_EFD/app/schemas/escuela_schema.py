from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional
from uuid import UUID

class escuela_request(BaseModel):
    nombre: str = Field(..., max_length=100, min_length=2)
    descripcion: Optional[str] = Field(None, max_length=255)
    ranInferior: int = Field(..., ge=0)
    ranSuperior: int = Field(..., ge=0)
    administrador_uuid: UUID = Field(...)


class escuela_response(BaseModel):
    uuid: str
    nombre: str
    descripcion: Optional[str]
    ranInferior: int
    ranSuperior: int

    model_config = ConfigDict(from_attributes=True)