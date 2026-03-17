from sqlalchemy.orm import Session
from app.models.rol import Rol
from fastapi import HTTPException, status


class rol_service:
    @staticmethod
    def listar_roles(db: Session):
        try:
            roles = db.query(Rol).all()
            return roles
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    
    @staticmethod
    def listar_roles_permitidos(db: Session):
        try: 
            roles = db.query(Rol).filter(Rol.nombre != "representante").all()
            return roles
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")

    @staticmethod
    def listar_roles_permitidos(db: Session):
        try: 
            roles = db.query(Rol).filter(Rol.nombre != "representante").all()
            return roles
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en el servidor: {str(e)}")
    