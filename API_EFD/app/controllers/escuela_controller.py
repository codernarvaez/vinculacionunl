from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.escuela_service import escuela_service
from app.schemas.response_schema import api_response
from app.schemas.escuela_schema import escuela_request, escuela_response
from datetime import date

class escuela_controller:
    router = APIRouter(prefix="/escuelas", tags=["Escuelas"])
    
    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[escuela_response])
    def crear_escuela(escuela_data: escuela_request, db: Session = Depends(get_db)):
        try:
            nueva_escuela = escuela_service.crear_escuela(db, escuela_data)
            return api_response(
                code=status.HTTP_201_CREATED,
                msg="Escuela creada exitosamente",
                data=nueva_escuela
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    
    @router.get("/disponibles", response_model=api_response[list[escuela_response]], status_code=status.HTTP_200_OK)
    def listar_escuelas_disponibles(db: Session = Depends(get_db)):
        try:
            escuelas = escuela_service.listar_escuelas_disponibles(db)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Escuelas disponibles listadas exitosamente",
                data=escuelas
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
        
    
    @router.get("/disponibles/{fecha_nacimiento}", response_model=api_response[list[escuela_response]], status_code=status.HTTP_200_OK)
    def listar_escuelas_por_fecha_nacimiento(fecha_nacimiento: date, db: Session = Depends(get_db)):
        try:
            escuelas = escuela_service.listar_escuelas_por_fecha_nacimiento(db, fecha_nacimiento)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Escuelas por fecha de nacimiento listadas exitosamente",
                data=escuelas
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")