from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from app.schemas.rol_schema import RolResponse

class login_request(BaseModel):
    correo: EmailStr
    clave: str
    cloudflare_token: str

class CuentaResponse(BaseModel):
    uuid: str
    correo: str
    estado: bool
    rol: RolResponse  
    
    model_config = ConfigDict(from_attributes=True)

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

class cuenta_estado_update(BaseModel):
    estado: bool

class cuenta_rol_update(BaseModel):
    rol_uuid: str

# Schemas para recuperación de contraseña
class RecuperacionRequest(BaseModel):
    correo: EmailStr

class VerificarCodigoRequest(BaseModel):
    correo: EmailStr
    codigo: str

class RestablecerClaveRequest(BaseModel):
    correo: EmailStr
    codigo: str
    nueva_clave: str