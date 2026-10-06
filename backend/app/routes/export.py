import csv
import io
from fastapi import APIRouter, Depends, Response as FastAPIResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Rating, Response, AblationTest, Evaluator, Persona, Concept

router = APIRouter(prefix="/api/export", tags=["export"])

@router.get("/ratings")
def export_ratings_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # CSV Header
    writer.writerow([
        "Rating_ID", "Evaluator_Name", "Student_ID", "Department", "Concept",
        "Persona", "Clarity", "Correctness", "Usefulness", "Engagement",
        "Persona_Match", "Overall_Rating", "What_Liked", "What_Could_Improve", "Timestamp"
    ])
    
    ratings = db.query(Rating).join(Response).join(Evaluator).all()
    for r in ratings:
        writer.writerow([
            r.id,
            r.evaluator.name,
            r.evaluator.student_id or "",
            r.evaluator.department,
            r.response.concept_name,
            r.response.persona.name if r.response.persona else "",
            r.clarity,
            r.correctness,
            r.usefulness,
            r.engagement,
            r.persona_match,
            r.overall_rating,
            r.comments_like or "",
            r.comments_improve or "",
            r.timestamp.isoformat()
        ])
        
    output.seek(0)
    return FastAPIResponse(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=student_evaluation_ratings.csv"}
    )

@router.get("/experiments")
def export_experiments_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # CSV Header
    writer.writerow([
        "Experiment_ID", "Concept_Name", "Category", "Difficulty", "Persona",
        "Prompt_Version", "Prompt_Text", "Response_Text", "Latency_MS", "Is_Demo",
        "Rating_Count", "Avg_Overall_Rating", "Timestamp"
    ])
    
    responses = db.query(Response).join(Persona).all()
    for resp in responses:
        ratings = resp.ratings
        r_count = len(ratings)
        avg_rating = round(sum(r.overall_rating for r in ratings) / r_count, 2) if r_count > 0 else 0.0
        category = resp.concept.category if resp.concept else "General"
        
        writer.writerow([
            resp.id,
            resp.concept_name,
            category,
            resp.difficulty,
            resp.persona.name,
            resp.prompt_version,
            resp.prompt_text,
            resp.response_text,
            resp.latency_ms,
            resp.is_demo,
            r_count,
            avg_rating,
            resp.timestamp.isoformat()
        ])
        
    output.seek(0)
    return FastAPIResponse(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=20_concept_experiment_results.csv"}
    )

@router.get("/ablation")
def export_ablation_csv(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # CSV Header
    writer.writerow([
        "Test_ID", "Concept_Name", "Persona", "Configuration", "Prompt_Text",
        "Response_Snippet", "Clarity", "Correctness", "Usefulness", "Engagement",
        "Persona_Match", "Overall_Score", "Timestamp"
    ])
    
    tests = db.query(AblationTest).join(Persona).all()
    for t in tests:
        writer.writerow([
            t.id,
            t.concept_name,
            t.persona.name,
            t.configuration,
            t.prompt_text,
            t.response_text[:300].replace("\n", " "),
            t.clarity,
            t.correctness,
            t.usefulness,
            t.engagement,
            t.persona_match,
            t.overall_score,
            t.timestamp.isoformat()
        ])
        
    output.seek(0)
    return FastAPIResponse(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ablation_study_results.csv"}
    )
