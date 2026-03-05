from sqlalchemy import Table, Column, ForeignKey, Boolean
from app.models.base_model_orm import BaseModelORM 

inscripciones = Table(
    "inscripciones",
    BaseModelORM.metadata,
    Column("estado", Boolean, default=True),
    Column("participante_id", ForeignKey("participantes.id"), primary_key=True),
    Column("escuela_id", ForeignKey("escuelas.id"), primary_key=True),
)