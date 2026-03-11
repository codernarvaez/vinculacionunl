from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.core.security import get_current_user
from uuid import UUID
from app.services.cuenta_service import cuenta_service
from app.schemas.cuenta_schema import login_request, login_response, cuenta_estado_update, cuenta_rol_update
from app.schemas.response_schema import api_response
from app.models.cuenta import Cuenta
class cuenta_controller:

    router = APIRouter(prefix="/cuentas", tags=["Cuentas"])

    @router.post("/login", response_model=api_response[login_response], status_code=status.HTTP_200_OK)
    def login(login_data: login_request, db: Session = Depends(get_db)):
        try:
            resultado = cuenta_service.login(db, login_data.correo, login_data.clave)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Login exitoso",
                data=resultado
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{cuenta_uuid}/estado", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def cambiar_estado(cuenta_uuid: str, data: cuenta_estado_update, db: Session = Depends(get_db)):
        try:
            cuenta_service.cambiar_estado(db, cuenta_uuid, data.estado)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Estado de cuenta actualizado exitosamente",
                data=None
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{cuenta_uuid}/rol", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def cambiar_rol(cuenta_uuid: str, data: cuenta_rol_update, db: Session = Depends(get_db)):
        try:
            cuenta_service.cambiar_rol(db, cuenta_uuid, data.rol_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Rol de cuenta actualizado exitosamente",
                data=None
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
