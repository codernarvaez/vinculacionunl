from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.get_db import get_db
from app.services.participante_service import participante_service
from app.schemas.response_schema import api_response
from app.schemas.participante_schema import participante_request, participante_response, participantes_paginados, participante_escuela_update
from datetime import date
from uuid import UUID
from fastapi import UploadFile, File, Form
from app.models.participante import TipoGenero
from typing import Optional
from app.services.cuenta_service import cuenta_service
from app.models.cuenta import Cuenta

class participante_controller:
    router = APIRouter(prefix="/participantes", tags=["Participantes"])

    @router.post("/", status_code=status.HTTP_201_CREATED, response_model=api_response[participante_response])
    def inscribir_participante_a_escuela(
        nombres: str = Form(...),
        apellidos: str = Form(...),
        cedula: str = Form(...),
        fechaNac: date = Form(...),
        genero: TipoGenero = Form(...),
        acepto_terminos: str = Form(...),
        representante_uuid: UUID = Form(...),
        escuela_uuid: UUID = Form(...),
        condicionMedica: Optional[str] = Form(None),
        foto: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: Cuenta = Depends(cuenta_service.RoleChecker(["representante"]))
    ):
        try:
            if str(current_user.persona.uuid) != str(representante_uuid):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="No tienes permiso para inscribir participantes"
                )
            
            val_acepto = acepto_terminos.lower() in ['true', '1', 'yes']
            data_dict = {
                "nombres": nombres,
                "apellidos": apellidos,
                "cedula": cedula,
                "fechaNac": fechaNac,
                "genero": genero,
                "acepto_terminos": val_acepto,
                "representante_uuid": representante_uuid,
                "escuela_uuid": escuela_uuid,
                "condicionMedica": condicionMedica,
                "foto": foto
            }
            
            from types import SimpleNamespace
            participante_data = SimpleNamespace(**data_dict)

            nuevo_participante = participante_service.inscribir_participante_a_escuela(db, participante_data)
            
            return api_response(
                code=status.HTTP_201_CREATED,
                msg="Participante inscrito exitosamente",
                data=nuevo_participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            print(f"Error detallado: {e}")
            raise HTTPException(status_code=500, detail=str(e))
        
    @router.get("/{participante_uuid}", response_model=api_response[participante_response], status_code=status.HTTP_200_OK)
    def obtener_participante(participante_uuid: str, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.get_current_user)):
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
    def listar_participantes_inscritos(escuela_uuid: str, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor"]))):
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
    def listar_participantes_por_representante(representante_uuid: str, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.get_current_user)):
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

    @router.get("/", response_model=api_response[participantes_paginados], status_code=status.HTTP_200_OK)
    def listar_participantes(
        skip: int = 0,
        limit: int = 100,
        escuela_uuid: Optional[str] = None,
        q: Optional[str] = None,
        db: Session = Depends(get_db),
        current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor"]))):
        try:
            resultado = participante_service.listar_participantes(
                db, skip=skip, limit=limit, search=q, escuela_uuid=escuela_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participantes listados exitosamente",
                data=resultado
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{participante_uuid}/escuela", response_model=api_response[participante_response], status_code=status.HTTP_200_OK)
    def cambiar_escuela_participante(participante_uuid: str, data: participante_escuela_update, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor"]))):
        try:
            participante = participante_service.cambiar_escuela_participante(db, participante_uuid, str(data.escuela_uuid))
            return api_response(
                code=status.HTTP_200_OK,
                msg="Escuela de participante actualizada exitosamente",
                data=participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @router.put("/{participante_uuid}", response_model=api_response[participante_response], status_code=status.HTTP_200_OK)
    def actualizar_participante_e_inscripcion(
        participante_uuid: str,
        nombres: str = Form(...),
        apellidos: str = Form(...),
        cedula: str = Form(...),
        fechaNac: date = Form(...),
        genero: TipoGenero = Form(...),
        escuela_uuid: str = Form(...),
        condicionMedica: Optional[str] = Form(None),
        foto: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
        current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor"]))
    ):
        try:
            data_dict = {
                "nombres": nombres,
                "apellidos": apellidos,
                "cedula": cedula,
                "fechaNac": fechaNac,
                "genero": genero,
                "escuela_uuid": escuela_uuid,
                "condicionMedica": condicionMedica,
                "foto": foto
            }
            from types import SimpleNamespace
            participante_data = SimpleNamespace(**data_dict)
            participante = participante_service.actualizar_participante_e_inscripcion(db, participante_uuid, participante_data)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participante actualizado exitosamente",
                data=participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")


    @router.put("/{participante_uuid}/dar_baja_escuela", response_model=api_response[participante_response], status_code=status.HTTP_200_OK)
    def dar_baja_de_escuela_a_un_participante(participante_uuid: str, db: Session = Depends(get_db), current_user: Cuenta = Depends(cuenta_service.RoleChecker(["gestor"]))):
        try:
            participante = participante_service.dar_baja_de_escuela_a_un_participante(db, participante_uuid)
            return api_response(
                code=status.HTTP_200_OK,
                msg="Participante dado de baja exitosamente",
                data=participante
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")