from fastapi import APIRouter, HTTPException, status, Depends, Response
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.core.security import get_current_user
from uuid import UUID
from app.services.cuenta_service import cuenta_service
from app.schemas.cuenta_schema import login_request, login_response, cuenta_estado_update, cuenta_rol_update, RecuperacionRequest, VerificarCodigoRequest, RestablecerClaveRequest
from app.schemas.response_schema import api_response
from app.models.cuenta import Cuenta
from app.utils.captcha import verify_turnstile_token

class cuenta_controller:

    router = APIRouter(prefix="/cuentas", tags=["Cuentas"])

    @router.post("/login", response_model=api_response[login_response], status_code=status.HTTP_200_OK)
    async def login(response: Response, login_data: login_request, db: Session = Depends(get_db)):
        try:
            # Verify Cloudflare Turnstile Captcha
            await verify_turnstile_token(login_data.cloudflare_token)
            
            resultado = cuenta_service.login(response, db, login_data.correo, login_data.clave)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Login exitoso",
                data=resultado
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
            
    def cambiar_estado(cuenta_uuid: str, data: cuenta_estado_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["administrador"]))):
        try:
            cuenta_service.cambiar_estado(db, cuenta_uuid, data.estado)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Estado de cuenta actualizado exitosamente",
                data=None
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{cuenta_uuid}/estado", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def cambiar_estado(cuenta_uuid: str, data: cuenta_estado_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["administrador"]))):
        try:
            cuenta_service.cambiar_estado(db, cuenta_uuid, data.estado)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Estado de cuenta actualizado exitosamente",
                data=None
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{cuenta_uuid}/rol", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def cambiar_rol(cuenta_uuid: str, data: cuenta_rol_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["administrador"]))):
        try:
            cuenta_service.cambiar_rol(db, cuenta_uuid, data.rol_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Rol de cuenta actualizado exitosamente",
                data=None
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.post("/recuperacion/solicitar", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def solicitar_recuperacion(data: RecuperacionRequest, db: Session = Depends(get_db)):
        try:
            resultado = cuenta_service.solicitar_recuperacion(db, data.correo)
            return api_response(
                code=status.HTTP_200_OK,
                msg=resultado["msg"],
                data=None
            )
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.post("/recuperacion/verificar", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def verificar_codigo(data: VerificarCodigoRequest, db: Session = Depends(get_db)):
        try:
            resultado = cuenta_service.verificar_codigo(db, data.correo, data.codigo)
            return api_response(
                code=status.HTTP_200_OK,
                msg=resultado["msg"],
                data=None
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.post("/recuperacion/restablecer", response_model=api_response[dict], status_code=status.HTTP_200_OK)
    def restablecer_clave(data: RestablecerClaveRequest, db: Session = Depends(get_db)):
        try:
            resultado = cuenta_service.restablecer_clave(db, data.correo, data.codigo, data.nueva_clave)
            return api_response(
                code=status.HTTP_200_OK,
                msg=resultado["msg"],
                data=None
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.post("/logout")
    def logout(response: Response, current_user: Cuenta = Depends(cuenta_service.get_current_user)):
        response.delete_cookie(
            key="access_token",
            httponly=True,
            secure=True,
            samesite="none"
        )
        response.headers["Clear-Site-Data"] = '"cache", "cookies", "storage"'
        return {"msg": "Sesión cerrada correctamente"}