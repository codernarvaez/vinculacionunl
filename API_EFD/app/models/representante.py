from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .persona import Persona

class Representante(Persona):
    __tablename__ = "representantes"

    id = Column(Integer, ForeignKey("personas.id"), primary_key=True)

    contacto = Column(String(100), nullable=False)
    domicilio = Column(String(150), nullable=False)

    participantes = relationship("Participante", back_populates="representante")

    __mapper_args__ = {
        "polymorphic_identity": "representante",
    }