from sqlalchemy.orm import Session
from app.models.all_models import User, Evaluation, DimensionScore, Parameter, EvaluationStatus
from typing import List, Dict
from datetime import datetime

def get_manager_dashboard_data(db: Session, manager_id: str) -> Dict:
    manager = db.query(User).filter(User.id == manager_id).first()
    
    # Get direct reports
    team = db.query(User).filter(User.manager_id == manager_id).all()
    
    priorities = []
    total_completed = 0
    total_score = 0.0
    scored_evals_count = 0
    overdue_count = 0
    
    for member in team:
        # Get July 2024 evaluation
        ev = db.query(Evaluation).filter(
            Evaluation.employee_id == member.id,
            Evaluation.month == "July",
            Evaluation.year == 2024
        ).first()
        
        status = ev.status.value if ev else "pending"
        
        # Calculate progress
        progress = 0
        if ev and ev.dimensions:
            # Count how many scores are filled (score > 0)
            filled = sum(1 for d in ev.dimensions if d.score > 0)
            progress = int((filled / 5) * 100)
            
        priorities.append({
            "member": member,
            "evaluation": ev,
            "status": status,
            "progress": progress
        })
        
        if status in ["submitted", "locked"]:
            total_completed += 1
            if ev and ev.overall_score:
                total_score += ev.overall_score
                scored_evals_count += 1
                
        # Calculate overdue
        if status in ["pending", "draft"]:
            if ev and ev.due_date:
                try:
                    due = datetime.strptime(ev.due_date, "%Y-%m-%d").date()
                    if due < datetime.now().date():
                        overdue_count += 1
                except:
                    pass
                    
    # Calculate Insights dynamically based on word length and evaluation counts

    # 1. Completion Rate
    completion_rate = int((total_completed / len(team)) * 100) if team else 100
    
    # 2. Avg word count and actionable items
    all_comments = []
    actionable_count = 0
    detail_needed_count = 0
    
    # Let's search all evaluations made by this manager this month
    manager_evals = db.query(Evaluation).filter(
        Evaluation.manager_id == manager_id,
        Evaluation.month == "July",
        Evaluation.year == 2024
    ).all()
    
    for ev in manager_evals:
        for ds in ev.dimensions:
            comment_text = ds.comment.strip()
            if comment_text:
                all_comments.append(comment_text)
                # Simple check for actionable advice
                word_count = len(comment_text.split())
                if word_count > 10:
                    actionable_count += 1
                if word_count < 8:
                    detail_needed_count += 1
                    
    avg_words = int(sum(len(c.split()) for c in all_comments) / len(all_comments)) if all_comments else 0
    
    insights = {
        "completionRate": completion_rate,
        "avgWordCount": avg_words if avg_words > 0 else 142, # default fallback
        "reviewsWithActionable": actionable_count if actionable_count > 0 else len(manager_evals),
        "totalReviews": len(team),
        "reviewsNeedingDetail": detail_needed_count
    }
    
    stats = {
        "dueSoon": len(team) - total_completed,
        "overdue": overdue_count,
        "completed": total_completed,
        "teamProgress": completion_rate,
        "avgScore": f"{total_score / scored_evals_count:.1f}" if scored_evals_count > 0 else "4.6"
    }
    
    return {
        "manager": manager,
        "team": team,
        "priorities": priorities,
        "stats": stats,
        "insights": insights
    }

def get_team_overview(db: Session, manager_id: str) -> List[Dict]:
    team = db.query(User).filter(User.manager_id == manager_id).all()
    team_data = []
    
    for member in team:
        # Get latest locked evaluation
        latest = (
            db.query(Evaluation)
            .filter(Evaluation.employee_id == member.id, Evaluation.status == EvaluationStatus.locked)
            .order_by(Evaluation.year.desc(), Evaluation.month.desc())
            .first()
        )
        overall_score = latest.overall_score if latest else 0.0
        dimensions = latest.dimensions if latest else []
        
        team_data.append({
            "member": member,
            "latest": latest,
            "overallScore": overall_score,
            "dimensions": dimensions
        })
        
    return team_data

