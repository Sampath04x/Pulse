from sqlalchemy.orm import Session
from app.models.all_models import User, Evaluation, DimensionScore, Parameter, EvaluationStatus
from typing import List, Dict

def get_employee_dashboard_data(db: Session, user_id: str) -> Dict:
    user = db.query(User).filter(User.id == user_id).first()
    
    # Get overall locked evaluations for timeline
    locked_evals = (
        db.query(Evaluation)
        .filter(Evaluation.employee_id == user_id, Evaluation.status == EvaluationStatus.locked)
        .order_by(Evaluation.year.desc(), Evaluation.month.desc())
        .all()
    )
    
    latest = locked_evals[0] if locked_evals else None
    
    # Generate 6 month history for chart
    # Let's map it chronologically
    history_evals = (
        db.query(Evaluation)
        .filter(Evaluation.employee_id == user_id, Evaluation.status == EvaluationStatus.locked)
        .order_by(Evaluation.year.asc(), Evaluation.month.asc())
        .all()
    )
    history = []
    for ev in history_evals:
        history.append({
            "month": ev.month,
            "score": ev.overall_score or 0.0
        })
        
    # Get parameters
    params = db.query(Parameter).all()
    
    # Calculate trends per parameter
    dimension_trends = []
    for p in params:
        # Get score for this parameter in latest locked eval
        latest_score = 0
        prev_score = 0
        
        if latest:
            ds = db.query(DimensionScore).filter(
                DimensionScore.evaluation_id == latest.id,
                DimensionScore.parameter_id == p.id
            ).first()
            latest_score = ds.score if ds else 0
            
        # Get score for previous locked eval
        if len(locked_evals) > 1:
            prev_ev = locked_evals[1]
            ds_prev = db.query(DimensionScore).filter(
                DimensionScore.evaluation_id == prev_ev.id,
                DimensionScore.parameter_id == p.id
            ).first()
            prev_score = ds_prev.score if ds_prev else 0
            
        diff = latest_score - prev_score
        trend = "up" if diff > 0 else "down" if diff < 0 else "stable"
        
        label_text = "Holding steady"
        if latest_score >= 4.5:
            label_text = "Consistently strong"
        elif trend == "up" and latest_score >= 4:
            label_text = "Trending upward"
        elif trend == "up":
            label_text = "Improving this quarter"
        elif trend == "stable" and latest_score >= 4:
            label_text = "Growing steadily"
        elif latest_score <= 3 and latest_score > 0:
            label_text = "Room to grow"
            
        dimension_trends.append({
            "id": p.id,
            "label": p.label,
            "score": latest_score,
            "diff": diff,
            "trend": trend,
            "label_text": label_text
        })
        
    return {
        "user": user,
        "latest": latest,
        "history": history,
        "dimensionTrends": dimension_trends,
        "evaluations": locked_evals
    }
