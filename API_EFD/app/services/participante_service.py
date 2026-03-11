from sqlalchemy.orm import Session, joinedload, contains_eager
from sqlalchemy import or_
from app.models.participante import Participante
from app.models.representante import Representante
from app.models.escuela import Escuela
from app.models.inscripciones import inscripciones
from fastapi import HTTPException, status
from datetime import date
import os
import uuid
import shutil

class participante_service:

    

    def inscribir_participante_a_escuela(db: Session, participante_data):
        try:
            UPLOAD_DIR = "public/uploads"
            if not os.path.exists(UPLOAD_DIR):
                os.makedirs(UPLOAD_DIR)

            file_extension = os.path.splitext(participante_data.foto.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(participante_data.foto.file, buffer)

            representante_uuid_str = str(participante_data.representante_uuid)

            representante = db.query(Representante).filter(
                Representante.uuid == representante_uuid_str
            ).first()

            if not representante:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Representante no encontrado")

            participante = Participante(
                nombres=participante_data.nombres,
                apellidos=participante_data.apellidos,
                cedula=participante_data.cedula,
                fechaNac=participante_data.fechaNac,
                genero=participante_data.genero,
                condicionMedica=participante_data.condicionMedica,
                foto=file_path,
                acepto_terminos=participante_data.acepto_terminos,
                representante_id=representante.id
            )

            db.add(participante)
            db.flush()
            
            escuela_uuid_str = str(participante_data.escuela_uuid)
            escuela = db.query(Escuela).filter(
                Escuela.uuid == escuela_uuid_str
            ).first()

            if not escuela:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Escuela no encontrada")

            today = date.today()
            edad_participante = today.year - participante.fechaNac.year - (
                (today.month, today.day) < (participante.fechaNac.month, participante.fechaNac.day)
            )

            if not (escuela.ranInferior <= edad_participante <= escuela.ranSuperior):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"El participante tiene {edad_participante} años y no cumple con el rango ({escuela.ranInferior}-{escuela.ranSuperior})"
                )
            # Verificar si la escuela está activa
            if not escuela.estado:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La escuela no está activa para inscripciones")
            
            a_participante = db.query(Participante).filter(Participante.cedula == participante.cedula).first()

            # Verificar que el participante no esté inscrito en otra escuela
            inscripcion_existente = db.query(inscripciones).filter(
                inscripciones.c.participante_id == a_participante.id,
                inscripciones.c.estado == True
            ).first()

            if inscripcion_existente:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El participante ya está inscrito en otra escuela")

            # Verificar si el participante ya está inscrito en la escuela
            inscripcion_existente = db.query(inscripciones).filter(
                inscripciones.c.participante_id == participante.id,
                inscripciones.c.escuela_id == escuela.id
            ).first()

            if inscripcion_existente:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El participante ya está inscrito en esta escuela")

            # Inscribir al participante en la escuela
            stmt = inscripciones.insert().values(participante_id=participante.id, escuela_id=escuela.id)
            db.execute(stmt)
            db.commit()

            return participante
        except Exception as e:
            db.rollback()
            print(f"Log del error: {e}")
            raise e
    
    def listar_participantes_inscritos(db: Session, escuela_uuid: str):
        try:
            escuela = db.query(Escuela).filter(Escuela.uuid == escuela_uuid).first()
            if not escuela:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Escuela no encontrada")
            
            participantes = db.query(Participante).join(inscripciones, Participante.id == inscripciones.c.participante_id).filter(inscripciones.c.escuela_id == escuela.id).all()
            return participantes
        except Exception as e:
            print(f"Log del error: {e}")
            raise e
    
    def listar_participantes_por_representante(db: Session, representante_uuid: str):
        try:

            representante = db.query(Representante).filter(Representante.uuid == representante_uuid).first()
            if not representante:
                raise HTTPException(status_code=404, detail="Representante no encontrado")
            participantes = (
                db.query(Participante)
                .join(Participante.escuelas.and_(inscripciones.c.estado == True)) 
                .options(contains_eager(Participante.escuelas)) 
                .filter(Participante.representante_id == representante.id)
                .all()
            )
            
            return participantes
        except Exception as e:
            print(f"Log del error: {e}")
            raise e
    
    def obtener_participante(db: Session, participante_uuid: str):
        try:
            participante = db.query(Participante).filter(Participante.uuid == participante_uuid).first()
            if not participante:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participante no encontrado")
            return participante
        except Exception as e:
            print(f"Log del error: {e}")
            raise e

    def listar_participantes(db: Session, skip: int = 0, limit: int = 100, search: str = None):
        try:
            query = db.query(Participante)
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        Participante.nombres.ilike(search_term),
                        Participante.apellidos.ilike(search_term),
                        Participante.cedula.ilike(search_term)
                    )
                )
            
            total = query.count()
            items = query.offset(skip).limit(limit).all()
            
            return {
                "total": total,
                "items": items
            }
        except Exception as e:
            print(f"Log del error: {e}")
            raise e

    def cambiar_escuela_participante(db: Session, participante_uuid: str, nueva_escuela_uuid: str):
        try:
            participante = db.query(Participante).filter(Participante.uuid == participante_uuid).first()
            if not participante:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participante no encontrado")

            nueva_escuela = db.query(Escuela).filter(Escuela.uuid == nueva_escuela_uuid).first()
            if not nueva_escuela:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nueva escuela no encontrada")

            # Validate age requirement
            today = date.today()
            edad_participante = today.year - participante.fechaNac.year - (
                (today.month, today.day) < (participante.fechaNac.month, participante.fechaNac.day)
            )

            if not (nueva_escuela.ranInferior <= edad_participante <= nueva_escuela.ranSuperior):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"El participante tiene {edad_participante} años y no cumple con el rango ({nueva_escuela.ranInferior}-{nueva_escuela.ranSuperior}) de la nueva escuela"
                )

            # Check if school is active
            if not nueva_escuela.estado:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La nueva escuela no está activa")

            # Remove existing enrollment
            db.execute(
                inscripciones.delete().where(inscripciones.c.participante_id == participante.id)
            )

            # Insert new enrollment
            stmt = inscripciones.insert().values(participante_id=participante.id, escuela_id=nueva_escuela.id)
            db.execute(stmt)
            db.commit()

            return participante
        except Exception as e:
            db.rollback()
            print(f"Log del error: {e}")
            raise e