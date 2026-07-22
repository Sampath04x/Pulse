from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.all_models import Evaluation, DimensionScore, Parameter, User, EvaluationStatus
from typing import List, Dict

def get_evaluation_by_id(db: Session, evaluation_id: str) -> Evaluation:
    return db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()

def get_evaluations_for_employee(db: Session, employee_id: str) -> List[Evaluation]:
    return (
        db.query(Evaluation)
        .filter(Evaluation.employee_id == employee_id, Evaluation.status == EvaluationStatus.locked)
        .order_by(Evaluation.year.desc(), Evaluation.month.desc())
        .all()
    )

def save_evaluation_draft(db: Session, evaluation_id: str, dimensions: List[Dict]) -> Evaluation:
    ev = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    ev.status = EvaluationStatus.draft
    
    # Update or insert dimension scores
    for dim in dimensions:
        param_id = dim.get("parameter_id")
        score = dim.get("score", 0)
        comment = dim.get("comment", "")
        
        d_score = db.query(DimensionScore).filter(
            DimensionScore.evaluation_id == evaluation_id,
            DimensionScore.parameter_id == param_id
        ).first()
        
        if d_score:
            d_score.score = score
            d_score.comment = comment
        else:
            new_score = DimensionScore(
                evaluation_id=evaluation_id,
                parameter_id=param_id,
                score=score,
                comment=comment
            )
            db.add(new_score)
            
    db.commit()
    db.refresh(ev)
    return ev

def submit_evaluation(db: Session, evaluation_id: str, dimensions: List[Dict]) -> Evaluation:
    ev = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    # Save dimensions first
    save_evaluation_draft(db, evaluation_id, dimensions)
    
    # Fetch all dimension scores to calculate overall
    dim_scores = db.query(DimensionScore).filter(DimensionScore.evaluation_id == evaluation_id).all()
    
    if dim_scores:
        total = sum(d.score for d in dim_scores)
        overall = total / len(dim_scores)
        ev.overall_score = round(overall, 1)
    else:
        ev.overall_score = 0.0
        
    ev.status = EvaluationStatus.submitted
    db.commit()
    db.refresh(ev)
    return ev

def create_new_evaluation(
    db: Session, employee_id: str, manager_id: str, company_id: str, month: str, year: int
) -> Evaluation:
    # Check if exists
    exists = db.query(Evaluation).filter(
        Evaluation.employee_id == employee_id,
        Evaluation.month == month,
        Evaluation.year == year
    ).first()
    if exists:
        return exists
        
    # Get parameters to fill blank dimension scores
    params = db.query(Parameter).all()
    
    new_ev = Evaluation(
        company_id=company_id,
        employee_id=employee_id,
        manager_id=manager_id,
        month=month,
        year=year,
        status=EvaluationStatus.pending,
        due_date=f"{year}-07-31",
        overall_score=None
    )
    db.add(new_ev)
    db.flush() # get ID
    
    for p in params:
        ds = DimensionScore(
            evaluation_id=new_ev.id,
            parameter_id=p.id,
            score=0,
            comment=""
        )
        db.add(ds)
        
    db.commit()
    db.refresh(new_ev)
    return new_ev
