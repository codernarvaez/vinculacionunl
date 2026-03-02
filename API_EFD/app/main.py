from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# aqui importar modelos
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


#TODO revisar antes de subir a producción, restringir orígenes permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"RUTA BASE": " API de Escuela de formación deportiva"}


#app.include_router(proyecto_controller.router)


def run():
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
