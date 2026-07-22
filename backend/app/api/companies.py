from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Company
from app.schemas.all_schemas import CompanySchema
from typing import List

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("", response_model=List[CompanySchema])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.get("/{company_id}", response_model=CompanySchema)
def get_company(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
