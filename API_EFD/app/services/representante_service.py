from fastapi import Depends, HTTPException, status
from ..models.cuenta import Cuenta
from ..models.representante import Representante
from ..models.rol import Rol
from sqlalchemy.orm import Session
from app.utils.utils import hash_password
class represenante_service:

    def crear_representante(db: Session, representante_data):
        try:
        # Crear la cuenta asociada al representante
            if db.query(Cuenta).filter(Cuenta.correo == representante_data.correo).first():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado")

            if db.query(Representante).filter(Representante.cedula == representante_data.cedula).first():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La cédula ya está registrada")
            
            
            rol_representante = db.query(Rol).filter(Rol.nombre == "representante").first()
            if not rol_representante:
                rol_representante = Rol(nombre="representante")
                db.add(rol_representante)
                db.flush()

            if not representante_data.acepto_terminos:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debe aceptar los términos y condiciones")
        
            if len(representante_data.clave) < 8:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La contraseña debe tener al menos 8 caracteres")

            if len(representante_data.cedula) < 10:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La cédula debe tener al menos 10 caracteres")

            representante_data.clave = hash_password(representante_data.clave)

            cuenta = Cuenta(
                correo=representante_data.correo,
                clave=representante_data.clave,
                rol_id=rol_representante.id
            )

            db.add(cuenta)
            db.flush()

            nuevo_representante = Representante(
                nombres=representante_data.nombres,
                apellidos=representante_data.apellidos,
                cedula=representante_data.cedula,
                contacto=representante_data.contacto,
                domicilio=representante_data.domicilio,
                acepto_terminos=representante_data.acepto_terminos,
                cuenta_id=cuenta.id
            )
            db.add(nuevo_representante)
            db.commit()
            db.refresh(nuevo_representante)

            return nuevo_representante
        except Exception as e:
            db.rollback()
            print(f"Log del error: {e}")
            raise e #   