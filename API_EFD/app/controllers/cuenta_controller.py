from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.core.security import get_current_user
from uuid import UUID
from app.services.cuenta_service import cuenta_service
from app.schemas.cuenta_schema import login_request, login_response
from app.schemas.response_schema import api_response

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
