from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.all_models import User
from app.schemas.all_schemas import ManagerDashboardResponse, TeamOverviewResponse
from app.services.manager_service import get_manager_dashboard_data, get_team_overview

router = APIRouter(prefix="/manager", tags=["Manager Coaching"])

@router.get("/dashboard", response_model=ManagerDashboardResponse)
def get_dashboard(
    current_user: User = Depends(require_role(["manager", "hr", "admin"])),
    db: Session = Depends(get_db)
):
    data = get_manager_dashboard_data(db, current_user.id)
    
    # Serialize manager
    mgr_data = {
        "id": data["manager"].id,
        "company_id": data["manager"].company_id,
        "department_id": data["manager"].department_id,
        "name": data["manager"].name,
        "title": data["manager"].title,
        "email": data["manager"].email,
        "initials": data["manager"].initials,
        "manager_id": data["manager"].manager_id,
        "join_date": data["manager"].join_date,
        "roles": [r.name for r in data["manager"].roles]
    }
    
    # Serialize team
    team_data = []
    for u in data["team"]:
        team_data.append({
            "id": u.id,
            "company_id": u.company_id,
            "department_id": u.department_id,
            "name": u.name,
            "title": u.title,
            "email": u.email,
            "initials": u.initials,
            "manager_id": u.manager_id,
            "join_date": u.join_date,
            "roles": [r.name for r in u.roles]
        })
        
    # Serialize priorities
    priority_data = []
    for p in data["priorities"]:
        ev = p["evaluation"]
        ev_data = None
        if ev:
            ev_data = {
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
            }
        priority_data.append({
            "member": {
                "id": p["member"].id,
                "company_id": p["member"].company_id,
                "department_id": p["member"].department_id,
                "name": p["member"].name,
                "title": p["member"].title,
                "email": p["member"].email,
                "initials": p["member"].initials,
                "manager_id": p["member"].manager_id,
                "join_date": p["member"].join_date,
                "roles": [r.name for r in p["member"].roles]
            },
            "evaluation": ev_data,
            "status": p["status"],
            "progress": p["progress"]
        })
        
    return {
        "manager": mgr_data,
        "team": team_data,
        "priorities": priority_data,
        "stats": data["stats"],
        "insights": data["insights"]
    }

@router.get("/team-overview", response_model=TeamOverviewResponse)
def get_overview(
    current_user: User = Depends(require_role(["manager", "hr", "admin"])),
    db: Session = Depends(get_db)
):
    team_overview_data = get_team_overview(db, current_user.id)
    
    serialized_team = []
    for item in team_overview_data:
        m = item["member"]
        ev = item["latest"]
        ev_data = None
        if ev:
            ev_data = {
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
            }
            
        serialized_team.append({
            "member": {
                "id": m.id,
                "company_id": m.company_id,
                "department_id": m.department_id,
                "name": m.name,
                "title": m.title,
                "email": m.email,
                "initials": m.initials,
                "manager_id": m.manager_id,
                "join_date": m.join_date,
                "roles": [r.name for r in m.roles]
            },
            "latest": ev_data,
            "overallScore": item["overallScore"],
            "dimensions": [{"parameter_id": d.parameter_id, "score": d.score, "comment": d.comment} for d in item["dimensions"]]
        })
        
    return {"team": serialized_team}
