from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from fastapi.responses import FileResponse

app = FastAPI(title = "APPI de Autenticacion JWT")

# Configurar CORS
origins = [
    "http://localhost:5173",  # Puerto de tu frontend
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permitir POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return FileResponse("favicon.ico")

@app.get("/")
def root():
    return {"message": "Bien venido a la API con JWT"}

