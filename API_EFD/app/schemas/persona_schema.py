from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.schemas.cuenta_schema import CuentaResponse

class persona_response(BaseModel):
    uuid: str
    nombres: str
    apellidos: str
    tipo: str
    cuenta: Optional[CuentaResponse]  
    model_config = ConfigDict(from_attributes=True)

class personas_paginadas(BaseModel):
    total: int
    items: List[persona_response]