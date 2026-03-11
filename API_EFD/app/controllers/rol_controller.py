from fastapi import APIRouter, HTTPException, status, Depends
from app.services.rol_service import rol_service
from app.schemas.response_schema import api_response
from app.schemas.rol_schema import RolResponse
from app.core.get_db import get_db
from sqlalchemy.orm import Session

class rol_controller:

    router = APIRouter(prefix="/roles", tags=["Roles"])

    @router.get("/", response_model=api_response[list[RolResponse]], status_code=status.HTTP_200_OK)
    def listar_roles(db: Session = Depends(get_db)):
        try:
            resultado = rol_service.listar_roles(db)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Roles listados exitosamente",
                data=resultado
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")