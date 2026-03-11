from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..models.cuenta import Cuenta
from ..core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from ..utils.utils import verify_password
from ..core.get_db import get_db
from ..schemas.cuenta_schema import token_data
class cuenta_service:



    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

    def login(db: Session, correo: str, contrasena: str):
        
        cuenta = db.query(Cuenta).filter(Cuenta.correo == correo).first()
        if not cuenta:
            raise ValueError("Correo o contraseña incorrectos")
        
        if not verify_password(contrasena, cuenta.clave):
            raise ValueError("Correo o contraseña incorrectos")
        

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=str(cuenta.id)
        )
        
        return {
            "uuid": str(cuenta.persona.uuid),
            "nombres": cuenta.persona.nombres if cuenta.persona else None,
            "apellidos": cuenta.persona.apellidos if cuenta.persona else None,
            "rol": cuenta.rol.nombre if cuenta.rol else None,
            "access_token": access_token,
            "token_type": "bearer"
        }

    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Cuenta:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudieron validar las credenciales",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception

            current_token_payload = token_data(id=user_id) 
            
        except JWTError:
            raise credentials_exception
        
        user = db.query(Cuenta).filter(Cuenta.id == current_token_payload.id).first()
        
        if user is None:
            raise credentials_exception
            
        return user

    def cambiar_estado(db: Session, cuenta_uuid: str, estado: bool):
        cuenta = db.query(Cuenta).filter(Cuenta.uuid == cuenta_uuid).first()
        if not cuenta:
            raise ValueError("Cuenta no encontrada")
        
        cuenta.estado = estado
        db.commit()
        db.refresh(cuenta)
        return cuenta

    def cambiar_rol(db: Session, cuenta_uuid: str, rol_uuid: str):
        cuenta = db.query(Cuenta).filter(Cuenta.uuid == cuenta_uuid).first()
        if not cuenta:
            raise ValueError("Cuenta no encontrada")
            
        from ..models.rol import Rol
        rol = db.query(Rol).filter(Rol.uuid == rol_uuid).first()
        if not rol:
            raise ValueError("Rol no encontrado")
            
        cuenta.rol_id = rol.id
        db.commit()
        db.refresh(cuenta)
        return cuenta
