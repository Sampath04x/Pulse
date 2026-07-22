from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.all_models import User
from app.core.security import verify_password, create_access_token

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Get roles
    roles = [r.name for r in user.roles]
    active_role = roles[0] if roles else "employee"
    
    # Create access token
    access_token = create_access_token(subject=user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "active_role": active_role
    }

def get_current_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()
