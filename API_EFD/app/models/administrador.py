from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .persona import Persona

class Administrador(Persona):
    __tablename__ = "administradores"

    id = Column(Integer, ForeignKey("personas.id"), primary_key=True)

    escuelas = relationship("Escuela", back_populates="administrador")

    __mapper_args__ = {
        "polymorphic_identity": "administrador",
    }