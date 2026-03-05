from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.participante_service import participante_service
from app.schemas.response_schema import api_response
from app.schemas.participante_schema import participante_request, participante_response
class participante_controller:
    router = APIRouter(prefix="/participantes", tags=["Participantes"])

    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[participante_response])
    def inscribir_participante_a_escuela(participante_data: participante_request, db: Session = Depends(get_db)):
        try:
           nuevo_participante = participante_service.inscribir_participante_a_escuela(db, participante_data)
           return api_response(
                code=status.HTTP_201_CREATED,
                msg="Participante inscrito exitosamente",
                data=nuevo_participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    
    @router.get("/{participante_uuid}", response_model=api_response[participante_response], status_code=status.HTTP_200_OK)
    def obtener_participante(participante_uuid: str, db: Session = Depends(get_db)):
        try:
            participante = participante_service.obtener_participante(db, participante_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participante obtenido exitosamente",
                data=participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    
    @router.get("/escuela/{escuela_uuid}", response_model=api_response[list[participante_response]], status_code=status.HTTP_200_OK)
    def listar_participantes_inscritos(escuela_uuid: str, db: Session = Depends(get_db)):
        try:
            participantes = participante_service.listar_participantes_inscritos(db, escuela_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participantes inscritos listados exitosamente",
                data=participantes
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    
    @router.get("/representante/{representante_uuid}", response_model=api_response[list[participante_response]], status_code=status.HTTP_200_OK)
    def listar_participantes_por_representante(representante_uuid: str, db: Session = Depends(get_db)):
        try:
            participantes = participante_service.listar_participantes_por_representante(db, representante_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participantes por representante listados exitosamente",
                data=participantes
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")