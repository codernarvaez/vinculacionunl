from app.models.persona import Persona
from fastapi import Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session, joinedload
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..models.cuenta import Cuenta
from ..core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from ..utils.utils import verify_password
from ..core.get_db import get_db
from ..schemas.cuenta_schema import token_data
class cuenta_service:



    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

    def login(response: Response, db: Session, correo: str, contrasena: str):
        cuenta = db.query(Cuenta).filter(Cuenta.correo == correo).first()
        if not cuenta or not verify_password(contrasena, cuenta.clave):
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

        if cuenta.estado == False:
            raise HTTPException(status_code=401, detail="Cuenta inactiva")

        access_token = create_access_token(subject=str(cuenta.id))
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,   
            secure=False,     
            samesite="lax",  
            max_age=3600,    
            path="/",        
        )
        
        return {
            "uuid": str(cuenta.persona.uuid),
            "nombres": cuenta.persona.nombres,
            "apellidos": cuenta.persona.apellidos,
            "rol": cuenta.rol.nombre
        }

    @staticmethod
    def get_current_user(
        access_token: str = Cookie(None), 
        db: Session = Depends(get_db)
    ) -> Cuenta:
        
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudieron validar las credenciales o la sesión expiró",
        )

        if access_token is None:
            raise credentials_exception

        try:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            
            if user_id is None:
                raise credentials_exception
                
        except JWTError:
            raise credentials_exception
        
        user = db.query(Cuenta).options(
            joinedload(Cuenta.persona)
        ).filter(Cuenta.id == user_id).first()
        
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

    @staticmethod
    def RoleChecker(allowed_roles: list[str]):
        def role_verifier(current_user: Cuenta = Depends(cuenta_service.get_current_user)):
            if current_user.rol.nombre.lower() not in [role.lower() for role in allowed_roles]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No tienes permisos suficientes para realizar esta acción"
                )
            return current_user
        return role_verifier