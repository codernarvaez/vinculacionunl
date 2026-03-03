from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base_model_orm import BaseModelORM

class Cuenta(BaseModelORM):
    __tablename__ = "cuentas"

    correo = Column(String(100), nullable=False, unique=True)
    clave = Column(String(255), nullable=False)

    rol_id = Column(ForeignKey("roles.id"), nullable=False)
    rol = relationship("Rol", back_populates="cuentas")

    persona = relationship("Persona", back_populates="cuenta", uselist=False)