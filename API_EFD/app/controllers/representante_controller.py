from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.core.security import get_current_user
from uuid import UUID
from ..schemas.representante_schema import representante_request, RepresentanteResponse
from ..services.representante_service import represenante_service
from ..schemas.response_schema import api_response
from app.services.cuenta_service import cuenta_service

class representante_controller:
    router = APIRouter(prefix="/representantes", tags=["Representantes"])

    #enpoint para crear un representante y su cuenta asociada
    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[RepresentanteResponse])
    def crear_representante(representante_data: representante_request, db: Session = Depends(get_db)):
        try:
            nuevo_representante = represenante_service.crear_representante(db, representante_data)
            return api_response(code=status.HTTP_201_CREATED, 
                                msg="Representante creado exitosamente", 
                                data=nuevo_representante)
        
        except HTTPException as e:
            raise e
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
        