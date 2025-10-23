from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from .schemas import UserCreate, UserLogin, User
from .utils import hash_password, verify_password, create_access_token, verify_token
from .models import fake_users_db
import uuid

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Registro
@router.post("/register", response_model=User)
def register(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    user_id = str(uuid.uuid4())
    fake_users_db[user.email] = {
        "id": user_id,
        "email": user.email,
        "hashed_password": hash_password(user.password)
    }
    return {"id": user_id, "email": user.email}

# Login
@router.post("/login")
def login(user: UserLogin):
    db_user = fake_users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# Obtener usuario actual
@router.get("/me", response_model=User)
def me(token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    if not email or email not in fake_users_db:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    user = fake_users_db[email]
    return {"id": user["id"], "email": user["email"]}

