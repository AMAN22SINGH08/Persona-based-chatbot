from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Response, Rating, AblationTest, Evaluator, Concept, Persona
from app.schemas import SettingsOut, SettingsUpdate
from app import config
from app.seed_data import seed_database

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=SettingsOut)
def get_settings():
    return SettingsOut(
        has_api_key=bool(config.OPENAI_API_KEY),
        openai_base_url=config.OPENAI_BASE_URL,
        openai_model=config.OPENAI_MODEL,
        is_demo_mode=config.is_demo_mode()
    )

@router.post("", response_model=SettingsOut)
def update_settings(update_data: SettingsUpdate):
    if update_data.openai_api_key is not None:
        config.OPENAI_API_KEY = update_data.openai_api_key.strip()
    if update_data.openai_base_url is not None:
        config.OPENAI_BASE_URL = update_data.openai_base_url.strip()
    if update_data.openai_model is not None:
        config.OPENAI_MODEL = update_data.openai_model.strip()
    if update_data.demo_mode is not None:
        config.DEMO_MODE_FORCED = "true" if update_data.demo_mode else "false"

    return SettingsOut(
        has_api_key=bool(config.OPENAI_API_KEY),
        openai_base_url=config.OPENAI_BASE_URL,
        openai_model=config.OPENAI_MODEL,
        is_demo_mode=config.is_demo_mode()
    )

@router.post("/reset-demo")
def reset_to_demo_data(db: Session = Depends(get_db)):
    """Re-seeds full standard demo dataset with 20 concepts, 100 baseline tests, 16 evaluators, and ratings."""
    res = seed_database(db, force=True)
    return {"message": "Database reset to standard Demo Dataset", "details": res}

@router.post("/fresh-experiment")
def start_fresh_experiment(db: Session = Depends(get_db)):
    """Clears all student ratings, user evaluations, and custom responses while preserving concepts & personas."""
    # Delete student ratings and ablation tests
    db.query(Rating).delete()
    db.query(AblationTest).delete()
    db.query(Evaluator).delete()
    
    # Reset is_demo flags or clear custom responses
    db.query(Response).filter(Response.is_demo == False).delete()
    db.commit()

    return {
        "message": "Fresh experiment initiated. All student ratings and ablation logs cleared.",
        "evaluators_count": 0,
        "ratings_count": 0
    }
