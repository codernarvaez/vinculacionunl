from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.cuenta_controller import cuenta_controller
from app.controllers.representante_controller import representante_controller
from app.controllers.administrador_controller import administrador_controller
from app.controllers.participante_controller import participante_controller
from app.controllers.escuela_controller import escuela_controller
from app.controllers.persona_controller import persona_controller
from app.controllers.rol_controller import rol_controller
from app.models import administrador, representante, escuela, participante, rol, cuenta, persona
from app.config.database import engine, Base


Base.metadata.create_all(bind=engine)

# print("TABLAS REGISTRADAS ANTES:", Base.metadata.tables.keys())
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)
# print("TABLAS REGISTRADAS DESPUES:", Base.metadata.tables.keys())

app = FastAPI(
    title="API de Escuela de formación deportiva",
    description="Enpoints disponibles para la gestión de representantes, escuelas y deportistas",
    version="0.0.1",
)

class CORSStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/public", StaticFiles(directory="public"), name="public")
#TODO revisar antes de subir a producción, restringir orígenes permitidos


@app.get("/")
def read_root():
    return {"RUTA BASE": " API de Escuela de formación deportiva"}

app.include_router(representante_controller.router)
app.include_router(cuenta_controller.router)
app.include_router(administrador_controller.router)
app.include_router(escuela_controller.router)
app.include_router(participante_controller.router)
app.include_router(persona_controller.router)
app.include_router(rol_controller.router)

def run():
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
