import uuid
from sqlalchemy import Column, Integer, String, DateTime, func
from ..config.database import Base

class BaseModelORM(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)