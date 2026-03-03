from sqlalchemy import Column, String, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from .persona import Persona

class Representante(Persona):
    __tablename__ = "representantes"

    id = Column(Integer, ForeignKey("personas.id"), primary_key=True)

    contacto = Column(String(100), nullable=False)
    domicilio = Column(String(150), nullable=False)
    acepto_terminos = Column(Boolean, nullable=False)
    cedula = Column(String(20), nullable=False, unique=True)

    participantes = relationship("Participante", back_populates="representante")

    __mapper_args__ = {
        "polymorphic_identity": "representante",
    }