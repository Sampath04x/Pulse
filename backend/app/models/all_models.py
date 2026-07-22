import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.association_tables import user_role

class EvaluationStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    submitted = "submitted"
    reviewed = "reviewed"
    locked = "locked"

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    theme = Column(String, nullable=False)
    logo = Column(String, nullable=False)
    tagline = Column(String, nullable=False)

    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    departments = relationship("Department", back_populates="company", cascade="all, delete-orphan")
    evaluations = relationship("Evaluation", back_populates="company", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)

    company = relationship("Company", back_populates="departments")
    users = relationship("User", back_populates="department")

class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False) # e.g. "employee", "manager", "hr", "admin"

    users = relationship("User", secondary=user_role, back_populates="roles")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    department_id = Column(String, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    initials = Column(String, nullable=False)
    manager_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    join_date = Column(String, nullable=False)

    company = relationship("Company", back_populates="users")
    department = relationship("Department", back_populates="users")
    roles = relationship("Role", secondary=user_role, back_populates="users")
    
    manager = relationship("User", remote_side=[id], backref="direct_reports")
    
    evaluations_received = relationship("Evaluation", foreign_keys="[Evaluation.employee_id]", back_populates="employee", cascade="all, delete-orphan")
    evaluations_created = relationship("Evaluation", foreign_keys="[Evaluation.manager_id]", back_populates="manager", cascade="all, delete-orphan")

class Parameter(Base):
    __tablename__ = "parameters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    label = Column(String, nullable=False)
    icon_name = Column(String, nullable=False)
    tip = Column(String, nullable=False)

    dimension_scores = relationship("DimensionScore", back_populates="parameter", cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    manager_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    month = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(SQLEnum(EvaluationStatus), default=EvaluationStatus.pending, nullable=False)
    due_date = Column(String, nullable=False)
    overall_score = Column(Float, nullable=True)

    company = relationship("Company", back_populates="evaluations")
    employee = relationship("User", foreign_keys=[employee_id], back_populates="evaluations_received")
    manager = relationship("User", foreign_keys=[manager_id], back_populates="evaluations_created")
    dimensions = relationship("DimensionScore", back_populates="evaluation", cascade="all, delete-orphan")

class DimensionScore(Base):
    __tablename__ = "dimension_scores"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    evaluation_id = Column(String, ForeignKey("evaluations.id", ondelete="CASCADE"), nullable=False)
    parameter_id = Column(String, ForeignKey("parameters.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, default=0, nullable=False)
    comment = Column(String, default="", nullable=False)

    evaluation = relationship("Evaluation", back_populates="dimensions")
    parameter = relationship("Parameter", back_populates="dimension_scores")
