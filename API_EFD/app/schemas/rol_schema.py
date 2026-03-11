from pydantic import BaseModel, ConfigDict


class RolResponse(BaseModel):
    uuid:str
    nombre: str
    
    model_config = ConfigDict(from_attributes=True)
