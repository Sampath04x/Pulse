from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.models.all_models import EvaluationStatus

# ── Auth ──
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    active_role: str

# ── Role ──
class RoleSchema(BaseModel):
    id: str
    name: str
    class Config:
        from_attributes = True

# ── Department ──
class DepartmentSchema(BaseModel):
    id: str
    company_id: str
    name: str
    class Config:
        from_attributes = True

# ── Company ──
class CompanySchema(BaseModel):
    id: str
    name: str
    theme: str
    logo: str
    tagline: str
    class Config:
        from_attributes = True

# ── User (Team Member) ──
class UserSchema(BaseModel):
    id: str
    company_id: str
    department_id: Optional[str] = None
    name: str
    title: str
    email: str
    initials: str
    manager_id: Optional[str] = None
    join_date: str
    roles: List[str] = []

    class Config:
        from_attributes = True

# ── Parameters ──
class ParameterSchema(BaseModel):
    id: str
    label: str
    icon_name: str
    tip: str
    class Config:
        from_attributes = True

# ── Evaluation Dimensions ──
class DimensionScoreSchema(BaseModel):
    parameter_id: str
    score: int
    comment: str
    class Config:
        from_attributes = True

class DimensionScoreUpdate(BaseModel):
    parameter_id: str
    score: int
    comment: str

# ── Evaluation ──
class EvaluationSchema(BaseModel):
    id: str
    company_id: str
    employee_id: str
    manager_id: str
    month: str
    year: int
    status: EvaluationStatus
    due_date: str
    overall_score: Optional[float] = None
    dimensions: List[DimensionScoreSchema] = []
    employee: Optional[UserSchema] = None

    class Config:
        from_attributes = True

# ── Dashboards & Analytics ──
class EmployeeDashboardResponse(BaseModel):
    user: UserSchema
    latest: Optional[EvaluationSchema] = None
    history: List[dict] = [] # list of {"month": "Jan", "score": 4.5}
    dimensionTrends: List[dict] = [] # list of parameter trends
    evaluations: List[EvaluationSchema] = []

class PriorityItem(BaseModel):
    member: UserSchema
    evaluation: Optional[EvaluationSchema] = None
    status: str
    progress: int

class ManagerDashboardResponse(BaseModel):
    manager: UserSchema
    team: List[UserSchema]
    priorities: List[PriorityItem]
    stats: dict
    insights: Optional[dict] = None

class TeamOverviewItem(BaseModel):
    member: UserSchema
    latest: Optional[EvaluationSchema] = None
    overallScore: float
    dimensions: List[DimensionScoreSchema] = []

class TeamOverviewResponse(BaseModel):
    team: List[TeamOverviewItem]

class HRDashboardResponse(BaseModel):
    stats: dict
    managersPending: List[dict]
    deptProgress: List[dict]
    trend: List[dict]
    waitingManagers: int

class OrgTreeNode(BaseModel):
    id: str
    company_id: str
    department_id: Optional[str]
    name: str
    title: str
    email: str
    initials: str
    manager_id: Optional[str]
    join_date: str
    roles: List[str] = []
    children: List['OrgTreeNode'] = []

    class Config:
        from_attributes = True
