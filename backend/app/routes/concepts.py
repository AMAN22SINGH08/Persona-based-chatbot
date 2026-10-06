from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Concept, Persona
from app.schemas import ConceptOut, PersonaOut

router = APIRouter(prefix="/api", tags=["concepts_and_personas"])

@router.get("/concepts", response_model=List[ConceptOut])
def get_concepts(db: Session = Depends(get_db)):
    concepts = db.query(Concept).all()
    return concepts

@router.get("/concepts/{slug}", response_model=ConceptOut)
def get_concept_by_slug(slug: str, db: Session = Depends(get_db)):
    concept = db.query(Concept).filter(Concept.slug == slug).first()
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concept

@router.get("/personas", response_model=List[PersonaOut])
def get_personas(db: Session = Depends(get_db)):
    personas = db.query(Persona).all()
    return personas

@router.get("/personas/{slug}", response_model=PersonaOut)
def get_persona_by_slug(slug: str, db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.slug == slug).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona
