from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.administrador import Administrador
from app.models.cuenta import Cuenta
from app.models.rol import Rol
from app.utils.utils import hash_password
class administrador_service:
    
    def crear_administrador(db: Session, administrador_data):
        try:
            
            if db.query(Cuenta).filter(Cuenta.correo == administrador_data.correo).first():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado")
            
            rol_administrador = db.query(Rol).filter(Rol.nombre == "administrador").first()
            if not rol_administrador:
                rol_administrador = Rol(nombre="administrador")
                db.add(rol_administrador)
                db.flush()
            administrador_data.clave = hash_password(administrador_data.clave)
            cuenta = Cuenta(
                correo=administrador_data.correo,
                clave=administrador_data.clave,
                rol_id=rol_administrador.id
            )
            db.add(cuenta)
            db.flush()            

            nuevo_administrador = Administrador(
                nombres=administrador_data.nombres,
                apellidos=administrador_data.apellidos,
                cuenta_id=cuenta.id
            )

            db.add(nuevo_administrador)
            db.commit()
            db.refresh(nuevo_administrador)
            return nuevo_administrador
        
        except Exception as e:
            db.rollback()
            print(f"Log del error: {e}")
            raise e
