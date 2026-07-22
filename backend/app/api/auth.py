from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.core.database import get_db
from app.core.config import settings
from app.schemas.all_schemas import LoginRequest, TokenResponse, UserSchema
from app.services.auth_service import authenticate_user, get_current_user_by_email
from app.models.all_models import User
import logging

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = get_current_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: list[str]):
    def dependency(current_user: User = Depends(get_current_user)):
        user_roles = [r.name for r in current_user.roles]
        if not any(role in user_roles for role in allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of roles {allowed_roles}"
            )
        return current_user
    return dependency

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    logging.info(f"User login attempt: {login_data.email}")
    return authenticate_user(db, login_data.email, login_data.password)

@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    # Build schema
    roles_list = [r.name for r in current_user.roles]
    return UserSchema(
        id=current_user.id,
        company_id=current_user.company_id,
        department_id=current_user.department_id,
        name=current_user.name,
        title=current_user.title,
        email=current_user.email,
        initials=current_user.initials,
        manager_id=current_user.manager_id,
        join_date=current_user.join_date,
        roles=roles_list
    )

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
