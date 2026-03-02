from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base_model_orm import BaseModelORM

class Persona(BaseModelORM):
    __tablename__ = "personas"

    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)

    cuenta_id = Column(ForeignKey("cuentas.id"), unique=True)
    cuenta = relationship("Cuenta", back_populates="persona")

    tipo = Column(String(50))

    __mapper_args__ = {
        "polymorphic_identity": "persona",
        "polymorphic_on": tipo
    }