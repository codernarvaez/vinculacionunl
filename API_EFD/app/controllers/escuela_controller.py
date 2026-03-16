from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.escuela_service import escuela_service
from app.schemas.response_schema import api_response
from app.schemas.escuela_schema import escuela_request, escuela_response, escuela_update, escuela_estado_update, escuelas_paginadas
from app.services.cuenta_service import cuenta_service
from app.models.cuenta import Cuenta
from datetime import date

class escuela_controller:
    router = APIRouter(prefix="/escuelas", tags=["Escuelas"])
    
    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[escuela_response])
    def crear_escuela(escuela_data: escuela_request, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor", "administrador"]))):
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
    def listar_escuelas_disponibles(db: Session = Depends(get_db) ):
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
    def listar_escuelas_por_fecha_nacimiento(fecha_nacimiento: date, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.get_current_user)):
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

    @router.put("/{escuela_uuid}", response_model=api_response[escuela_response], status_code=status.HTTP_200_OK)
    def modificar_escuela(escuela_uuid: str, update_data: escuela_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor", "administrador"]))):
        try:
            escuela_actualizada = escuela_service.modificar_escuela(db, escuela_uuid, update_data)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Escuela actualizada exitosamente",
                data=escuela_actualizada
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{escuela_uuid}/estado", response_model=api_response[escuela_response], status_code=status.HTTP_200_OK)
    def cambiar_estado_escuela(escuela_uuid: str, data: escuela_estado_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor", "administrador"]))):
        try:
            escuela_actualizada = escuela_service.cambiar_estado_escuela(db, escuela_uuid, data.estado)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Estado de escuela actualizado exitosamente",
                data=escuela_actualizada
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.get("/", response_model=api_response[list[escuela_response]], status_code=status.HTTP_200_OK)
    def listar_escuelas(db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.get_current_user)):
        try:
            resultado = escuela_service.listar_escuelas(db)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Escuelas listadas exitosamente",
                data=resultado
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")