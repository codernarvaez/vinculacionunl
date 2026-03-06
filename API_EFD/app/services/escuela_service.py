from sqlalchemy.orm import Session
from app.models.escuela import Escuela
from app.models.administrador import Administrador
from datetime import date

from fastapi import HTTPException, status
class escuela_service:
    
    def crear_escuela(db: Session, escuela_data):
        try:
            admin_uuid_str = str(escuela_data.administrador_uuid)

            administrador = db.query(Administrador).filter(
                Administrador.uuid == admin_uuid_str
            ).first()

            if not administrador:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")
            
            #validar que el rango inferior sea menor al rango superior
            if escuela_data.ranInferior >= escuela_data.ranSuperior:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rango inferior debe ser menor al rango superior")

            nueva_escuela = Escuela(
                nombre=escuela_data.nombre,
                descripcion=escuela_data.descripcion,
                ranInferior=escuela_data.ranInferior,
                ranSuperior=escuela_data.ranSuperior,
                administrador_id=administrador.id
            )
            db.add(nueva_escuela)
            db.commit()
            db.refresh(nueva_escuela)
            return nueva_escuela
        except Exception as e:
            db.rollback()
            print(f"Log del error: {e}")
            raise e
    
    def listar_escuelas_disponibles(db: Session):
        try:
            escuelas = db.query(Escuela).filter(Escuela.estado == True).all()
            return escuelas
        except Exception as e:
            print(f"Log del error: {e}")
            raise e
    
    #listar escuelas disponibles en base a una fecha de nacimiento
    def listar_escuelas_por_fecha_nacimiento(db: Session, fecha_nac):
        try:
            edad_participante = (date.today() - fecha_nac).days // 365
            
            escuelas = db.query(Escuela).filter(
                Escuela.estado == True,
                Escuela.ranInferior <= edad_participante,
                Escuela.ranSuperior >= edad_participante
            ).all()
            return escuelas
        except Exception as e:
            print(f"Log del error: {e}")
            raise e