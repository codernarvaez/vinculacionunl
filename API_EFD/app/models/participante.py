from sqlalchemy import Column, String, Date, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from app.models.base_model_orm import BaseModelORM
from .enums import TipoGenero
from .inscripciones import inscripciones

class Participante(BaseModelORM):
    __tablename__ = "participantes"

    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    cedula = Column(String(20), nullable=False, unique=True)
    fechaNac = Column(Date, nullable=False)
    genero = Column(Enum(TipoGenero), nullable=False)
    condicionMedica = Column(String(255))
    foto = Column(String(255))
    acepto_terminos = Column(Boolean, nullable=False)

    representante_id = Column(ForeignKey("representantes.id"))
    representante = relationship("Representante", back_populates="participantes")

    escuelas = relationship(
        "Escuela", 
        secondary=inscripciones, 
        back_populates="participantes"
    )