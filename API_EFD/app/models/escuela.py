from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.base_model_orm import BaseModelORM
from .inscripciones import inscripciones

class Escuela(BaseModelORM):
    __tablename__ = "escuelas"

    nombre = Column(String(150), nullable=False)
    descripcion = Column(String(255))
    ranInferior = Column(Integer, nullable=False)
    ranSuperior = Column(Integer, nullable=False)
    estado = Column(Boolean, default=True)

    administrador_id = Column(ForeignKey("administradores.id"))
    administrador = relationship("Administrador", back_populates="escuelas")

    participantes = relationship(
        "Participante", 
        secondary=inscripciones, 
        back_populates="escuelas"
    )