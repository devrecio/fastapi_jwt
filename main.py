from fastapi import FastAPI

from auth.routes import router as auth_router
from fastapi.responses import FileResponse

app = FastAPI(title = "APPI de Autenticacion JWT")

app.include_router(auth_router)

@app.get("/favicon.ici", include_in_schema=False)
def favicon():
    return FileResponse("favicon.ico")

@app.get("/")
def root():
    return {"message": "Bien venido a la API con JWT"}

