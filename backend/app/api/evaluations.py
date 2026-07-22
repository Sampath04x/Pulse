from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.all_models import User
from app.schemas.all_schemas import EvaluationSchema, DimensionScoreUpdate
from app.services.evaluation_service import (
    get_evaluation_by_id,
    save_evaluation_draft,
    submit_evaluation,
    create_new_evaluation
)
from typing import List

router = APIRouter(prefix="/evaluations", tags=["Conversations (Evaluations)"])

def serialize_eval(ev) -> dict:
    if not ev:
        return {}
    emp = ev.employee
    emp_data = None
    if emp:
        emp_data = {
            "id": emp.id,
            "company_id": emp.company_id,
            "department_id": emp.department_id,
            "name": emp.name,
            "title": emp.title,
            "email": emp.email,
            "initials": emp.initials,
            "manager_id": emp.manager_id,
            "join_date": emp.join_date,
            "roles": [r.name for r in emp.roles]
        }
        
    return {
        "id": ev.id,
        "company_id": ev.company_id,
        "employee_id": ev.employee_id,
        "manager_id": ev.manager_id,
        "month": ev.month,
        "year": ev.year,
        "status": ev.status,
        "due_date": ev.due_date,
        "overall_score": ev.overall_score,
        "dimensions": [{"parameter_id": d.parameter_id, "score": d.score, "comment": d.comment} for d in ev.dimensions],
        "employee": emp_data
    }

@router.get("/{id}", response_model=EvaluationSchema)
def get_eval(id: str, db: Session = Depends(get_db)):
    ev = get_evaluation_by_id(db, id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return serialize_eval(ev)

@router.post("/{id}/draft", response_model=EvaluationSchema)
def save_draft(
    id: str,
    dimensions: List[DimensionScoreUpdate],
    current_user: User = Depends(require_role(["manager", "hr", "admin"])),
    db: Session = Depends(get_db)
):
    dims_dict = [d.dict() for d in dimensions]
    ev = save_evaluation_draft(db, id, dims_dict)
    return serialize_eval(ev)

@router.post("/{id}/submit", response_model=EvaluationSchema)
def submit_eval(
    id: str,
    dimensions: List[DimensionScoreUpdate],
    current_user: User = Depends(require_role(["manager", "hr", "admin"])),
    db: Session = Depends(get_db)
):
    dims_dict = [d.dict() for d in dimensions]
    ev = submit_evaluation(db, id, dims_dict)
    return serialize_eval(ev)

@router.post("/create", response_model=EvaluationSchema)
def create_eval(
    employee_id: str = Query(...),
    month: str = Query("July"),
    year: int = Query(2024),
    current_user: User = Depends(require_role(["manager", "hr", "admin"])),
    db: Session = Depends(get_db)
):
    ev = create_new_evaluation(
        db,
        employee_id=employee_id,
        manager_id=current_user.id,
        company_id=current_user.company_id,
        month=month,
        year=year
    )
    return serialize_eval(ev)
