from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.all_models import User, Evaluation
from app.schemas.all_schemas import EmployeeDashboardResponse, EvaluationSchema
from app.services.employee_service import get_employee_dashboard_data
from app.services.evaluation_service import get_evaluations_for_employee
from typing import List

router = APIRouter(prefix="/employee", tags=["Employee Growth"])

@router.get("/dashboard", response_model=EmployeeDashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = get_employee_dashboard_data(db, current_user.id)
    # Serialize relationships correctly
    user_data = {
        "id": data["user"].id,
        "company_id": data["user"].company_id,
        "department_id": data["user"].department_id,
        "name": data["user"].name,
        "title": data["user"].title,
        "email": data["user"].email,
        "initials": data["user"].initials,
        "manager_id": data["user"].manager_id,
        "join_date": data["user"].join_date,
        "roles": [r.name for r in data["user"].roles]
    }
    
    latest_data = None
    if data["latest"]:
        latest_data = {
            "id": data["latest"].id,
            "company_id": data["latest"].company_id,
            "employee_id": data["latest"].employee_id,
            "manager_id": data["latest"].manager_id,
            "month": data["latest"].month,
            "year": data["latest"].year,
            "status": data["latest"].status,
            "due_date": data["latest"].due_date,
            "overall_score": data["latest"].overall_score,
            "dimensions": [{"parameter_id": d.parameter_id, "score": d.score, "comment": d.comment} for d in data["latest"].dimensions]
        }
        
    serialized_evals = []
    for ev in data["evaluations"]:
        serialized_evals.append({
            "id": ev.id,
            "company_id": ev.company_id,
            "employee_id": ev.employee_id,
            "manager_id": ev.manager_id,
            "month": ev.month,
            "year": ev.year,
            "status": ev.status,
            "due_date": ev.due_date,
            "overall_score": ev.overall_score,
            "dimensions": [{"parameter_id": d.parameter_id, "score": d.score, "comment": d.comment} for d in ev.dimensions]
        })
        
    return {
        "user": user_data,
        "latest": latest_data,
        "history": data["history"],
        "dimensionTrends": data["dimensionTrends"],
        "evaluations": serialized_evals
    }

@router.get("/history", response_model=List[EvaluationSchema])
def get_history(
    employee_id: str = Query(..., description="ID of employee to fetch history for"),
    db: Session = Depends(get_db)
):
    evals = get_evaluations_for_employee(db, employee_id)
    serialized_evals = []
    for ev in evals:
        serialized_evals.append({
            "id": ev.id,
            "company_id": ev.company_id,
            "employee_id": ev.employee_id,
            "manager_id": ev.manager_id,
            "month": ev.month,
            "year": ev.year,
            "status": ev.status,
            "due_date": ev.due_date,
            "overall_score": ev.overall_score,
            "dimensions": [{"parameter_id": d.parameter_id, "score": d.score, "comment": d.comment} for d in ev.dimensions]
        })
    return serialized_evals
