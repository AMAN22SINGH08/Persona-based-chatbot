from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import Response, Concept, Persona, Rating
from app.schemas import ExperimentOut

router = APIRouter(prefix="/api", tags=["experiments"])

@router.get("/experiments", response_model=List[ExperimentOut])
def list_experiments(
    concept: Optional[str] = Query(None),
    persona: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Response).join(Persona)
    
    if concept:
        query = query.filter(Response.concept_name.ilike(f"%{concept}%"))
    if persona:
        query = query.filter(Persona.slug == persona)
    if category:
        query = query.join(Concept, isouter=True).filter(Concept.category == category)
        
    responses = query.order_by(Response.id.asc()).limit(limit).all()
    
    results = []
    for resp in responses:
        # Compute rating metrics for this response
        ratings = resp.ratings
        r_count = len(ratings)
        avg_rating = round(sum(r.overall_rating for r in ratings) / r_count, 2) if r_count > 0 else 0.0
        
        crit = {
            "clarity": round(sum(r.clarity for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
            "correctness": round(sum(r.correctness for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
            "usefulness": round(sum(r.usefulness for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
            "engagement": round(sum(r.engagement for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
            "persona_match": round(sum(r.persona_match for r in ratings) / r_count, 2) if r_count > 0 else 0.0
        }
        
        category_name = resp.concept.category if resp.concept else "General"
        
        results.append(ExperimentOut(
            id=resp.id,
            concept_id=resp.concept_id,
            concept_name=resp.concept_name,
            category=category_name,
            persona_slug=resp.persona.slug,
            persona_name=resp.persona.name,
            prompt_version=resp.prompt_version,
            prompt_text=resp.prompt_text,
            response_text=resp.response_text,
            difficulty=resp.difficulty,
            length=resp.length,
            latency_ms=resp.latency_ms,
            is_demo=resp.is_demo,
            rating_count=r_count,
            average_rating=avg_rating,
            criteria_scores=crit,
            timestamp=resp.timestamp
        ))
        
    return results

@router.get("/experiments/{id}", response_model=ExperimentOut)
def get_experiment_detail(id: int, db: Session = Depends(get_db)):
    resp = db.query(Response).filter(Response.id == id).first()
    if not resp:
        raise HTTPException(status_code=404, detail="Experiment record not found")
        
    ratings = resp.ratings
    r_count = len(ratings)
    avg_rating = round(sum(r.overall_rating for r in ratings) / r_count, 2) if r_count > 0 else 0.0
    
    crit = {
        "clarity": round(sum(r.clarity for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
        "correctness": round(sum(r.correctness for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
        "usefulness": round(sum(r.usefulness for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
        "engagement": round(sum(r.engagement for r in ratings) / r_count, 2) if r_count > 0 else 0.0,
        "persona_match": round(sum(r.persona_match for r in ratings) / r_count, 2) if r_count > 0 else 0.0
    }
    
    category_name = resp.concept.category if resp.concept else "General"

    return ExperimentOut(
        id=resp.id,
        concept_id=resp.concept_id,
        concept_name=resp.concept_name,
        category=category_name,
        persona_slug=resp.persona.slug,
        persona_name=resp.persona.name,
        prompt_version=resp.prompt_version,
        prompt_text=resp.prompt_text,
        response_text=resp.response_text,
        difficulty=resp.difficulty,
        length=resp.length,
        latency_ms=resp.latency_ms,
        is_demo=resp.is_demo,
        rating_count=r_count,
        average_rating=avg_rating,
        criteria_scores=crit,
        timestamp=resp.timestamp
    )
