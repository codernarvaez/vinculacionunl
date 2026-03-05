from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.administrador_service import administrador_service
from app.schemas.administrador_schema import administrador_request, administrador_response
from app.schemas.response_schema import api_response
class administrador_controller:
    router = APIRouter(prefix="/administradores", tags=["Administradores"])

    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[administrador_response])
    def crear_administrador(administrador_data: administrador_request, db: Session = Depends(get_db)):
        try:
           nuevo_administrador = administrador_service.crear_administrador(db, administrador_data)
           return api_response(
                code=status.HTTP_201_CREATED,
                msg="Administrador creado exitosamente",
                data=nuevo_administrador
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")