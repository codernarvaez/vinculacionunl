from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.persona_service import persona_service
from app.schemas.response_schema import api_response
from app.schemas.persona_schema import personas_paginadas
class persona_controller:
    router = APIRouter(prefix="/personas", tags=["Personas"])

    @router.get("/", response_model=api_response[personas_paginadas], status_code=status.HTTP_200_OK)
    def listar_personas(skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(get_db)):
        try:
            resultado = persona_service.listar_personas(db, skip=skip, limit=limit, search=search)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Personas listadas exitosamente",
                data=resultado
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")