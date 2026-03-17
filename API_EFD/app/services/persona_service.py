from sqlalchemy.orm import Session, joinedload
from app.models.persona import Persona
from app.models.cuenta import Cuenta 
from sqlalchemy import or_
class persona_service:

    @staticmethod
    def listar_personas(db: Session, skip: int = 0, limit: int = 100, search: str = None, tipo_persona: str = None):
        try:
            query = db.query(Persona)

            if tipo_persona:
                query = query.filter(Persona.tipo.ilike(tipo_persona))

            if search:
                search_filter = f"%{search}%"
                query = query.filter(
                    or_(
                        Persona.nombres.ilike(search_filter),
                        Persona.apellidos.ilike(search_filter)
                    )
                )

            total = query.count()

            items = (
                query.options(
                    joinedload(Persona.cuenta).joinedload(Cuenta.rol)
                )
                .offset(skip)
                .limit(limit)
                .all()
            )

            return {"total": total, "items": items}
        except Exception as e:
            print(f"Error en listar_personas por tipo: {e}")
            raise e