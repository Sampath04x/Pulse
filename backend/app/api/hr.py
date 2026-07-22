from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, require_role
from app.models.all_models import User
from app.schemas.all_schemas import HRDashboardResponse, OrgTreeNode
from app.services.hr_service import get_hr_dashboard_data, get_org_tree

router = APIRouter(prefix="/hr", tags=["HR Organizational Health"])

@router.get("/dashboard", response_model=HRDashboardResponse)
def get_dashboard(
    current_user: User = Depends(require_role(["hr", "admin"])),
    db: Session = Depends(get_db)
):
    return get_hr_dashboard_data(db, current_user.company_id)

@router.get("/org-tree", response_model=OrgTreeNode)
def get_tree(
    current_user: User = Depends(require_role(["hr", "admin", "manager"])),
    db: Session = Depends(get_db)
):
    node = get_org_tree(db, current_user.company_id)
    
    def serialize_tree_node(n):
        return OrgTreeNode(
            id=n["id"],
            company_id=n["company_id"],
            department_id=n["department_id"],
            name=n["name"],
            title=n["title"],
            email=n["email"],
            initials=n["initials"],
            manager_id=n["manager_id"],
            join_date=n["join_date"],
            roles=n["roles"],
            children=[serialize_tree_node(c) for c in n["children"]]
        )
        
    return serialize_tree_node(node)
