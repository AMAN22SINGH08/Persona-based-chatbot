import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import Rating, Response, Evaluator
from app.schemas import RatingCreate, RatingOut, EvaluatorCreate, EvaluatorOut

router = APIRouter(prefix="/api", tags=["ratings"])

@router.post("/ratings", response_model=RatingOut)
def submit_rating(rating_in: RatingCreate, db: Session = Depends(get_db)):
    # Verify response exists
    response_obj = db.query(Response).filter(Response.id == rating_in.response_id).first()
    if not response_obj:
        raise HTTPException(status_code=404, detail="Response record not found")

    # Match or create evaluator
    evaluator_obj = None
    if rating_in.evaluator_id:
        evaluator_obj = db.query(Evaluator).filter(Evaluator.id == rating_in.evaluator_id).first()
    
    if not evaluator_obj and rating_in.evaluator_name:
        evaluator_obj = db.query(Evaluator).filter(func.lower(Evaluator.name) == rating_in.evaluator_name.strip().lower()).first()
        if not evaluator_obj:
            evaluator_obj = Evaluator(
                name=rating_in.evaluator_name.strip(),
                student_id=rating_in.student_id or f"EV{datetime.datetime.utcnow().strftime('%M%S')}",
                batch="2023-2027",
                department="Computer Science & Engineering"
            )
            db.add(evaluator_obj)
            db.flush()

    if not evaluator_obj:
        raise HTTPException(status_code=400, detail="Evaluator name is required")

    # Calculate overall average
    overall = round((
        rating_in.clarity +
        rating_in.correctness +
        rating_in.usefulness +
        rating_in.engagement +
        rating_in.persona_match
    ) / 5.0, 2)

    db_rating = Rating(
        response_id=response_obj.id,
        evaluator_id=evaluator_obj.id,
        clarity=rating_in.clarity,
        correctness=rating_in.correctness,
        usefulness=rating_in.usefulness,
        engagement=rating_in.engagement,
        persona_match=rating_in.persona_match,
        overall_rating=overall,
        comments_like=rating_in.comments_like,
        comments_improve=rating_in.comments_improve,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)

    return RatingOut(
        id=db_rating.id,
        response_id=db_rating.response_id,
        concept_name=response_obj.concept_name,
        persona_name=response_obj.persona.name if response_obj.persona else "Unknown",
        evaluator_name=evaluator_obj.name,
        clarity=db_rating.clarity,
        correctness=db_rating.correctness,
        usefulness=db_rating.usefulness,
        engagement=db_rating.engagement,
        persona_match=db_rating.persona_match,
        overall_rating=db_rating.overall_rating,
        comments_like=db_rating.comments_like,
        comments_improve=db_rating.comments_improve,
        timestamp=db_rating.timestamp
    )


@router.get("/ratings", response_model=List[RatingOut])
def list_ratings(
    evaluator_id: Optional[int] = Query(None),
    response_id: Optional[int] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    query = db.query(Rating).join(Response).join(Evaluator)
    if evaluator_id:
        query = query.filter(Rating.evaluator_id == evaluator_id)
    if response_id:
        query = query.filter(Rating.response_id == response_id)

    ratings = query.order_by(Rating.timestamp.desc()).limit(limit).all()

    return [
        RatingOut(
            id=r.id,
            response_id=r.response_id,
            concept_name=r.response.concept_name,
            persona_name=r.response.persona.name if r.response.persona else "Unknown",
            evaluator_name=r.evaluator.name,
            clarity=r.clarity,
            correctness=r.correctness,
            usefulness=r.usefulness,
            engagement=r.engagement,
            persona_match=r.persona_match,
            overall_rating=r.overall_rating,
            comments_like=r.comments_like,
            comments_improve=r.comments_improve,
            timestamp=r.timestamp
        )
        for r in ratings
    ]


@router.get("/evaluators", response_model=List[EvaluatorOut])
def list_evaluators(db: Session = Depends(get_db)):
    evaluators = db.query(Evaluator).order_by(Evaluator.id.asc()).all()
    return evaluators


@router.post("/evaluators", response_model=EvaluatorOut)
def create_evaluator(eval_in: EvaluatorCreate, db: Session = Depends(get_db)):
    existing = db.query(Evaluator).filter(func.lower(Evaluator.name) == eval_in.name.strip().lower()).first()
    if existing:
        return existing
        
    new_ev = Evaluator(
        name=eval_in.name.strip(),
        student_id=eval_in.student_id or f"EV{datetime.datetime.utcnow().strftime('%M%S')}",
        batch=eval_in.batch or "2023-2027",
        department=eval_in.department or "CSE / AI-ML"
    )
    db.add(new_ev)
    db.commit()
    db.refresh(new_ev)
    return new_ev
