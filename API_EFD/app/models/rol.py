from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base_model_orm import BaseModelORM

class Rol(BaseModelORM):
    __tablename__ = "roles"

    nombre = Column(String(50), nullable=False, unique=True)
    cuentas = relationship("Cuenta", back_populates="rol")