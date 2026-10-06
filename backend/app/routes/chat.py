import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Concept, Persona, Response, Rating
from app.schemas import ChatRequest, ChatResponse, PromptBreakdown, CompareRequest, CompareResponse, SinglePersonaComparison
from app.prompt_engine import build_modular_prompt, PERSONA_DEFINITIONS
from app.ai_service import generate_explanation

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_generate(request: ChatRequest, db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.slug == request.persona_slug).first()
    if not persona:
        persona = db.query(Persona).first()
    persona_slug = persona.slug if persona else "examiner"
    persona_name = persona.name if persona else "Examiner"

    # Build modular prompt with toggled components
    prompt_res = build_modular_prompt(
        persona_slug=persona_slug,
        concept=request.concept,
        difficulty=request.difficulty,
        length=request.length,
        include_role=request.include_role,
        include_tone=request.include_tone,
        include_format=request.include_format,
        include_examples=request.include_examples,
        include_instructions=request.include_instructions
    )
    
    full_prompt = prompt_res["full_prompt"]
    breakdown_data = prompt_res["breakdown"]

    # Generate response
    ai_result = await generate_explanation(
        prompt=full_prompt,
        concept=request.concept,
        persona_slug=persona_slug,
        difficulty=request.difficulty,
        length=request.length,
        breakdown=breakdown_data
    )

    # Find concept if exists in DB
    concept_obj = db.query(Concept).filter(func.lower(Concept.name) == request.concept.lower()).first()
    concept_id = concept_obj.id if concept_obj else None

    # Determine prompt version tag based on components
    active = breakdown_data.get("active_components", [])
    version_tag = "full" if len(active) >= 6 else f"custom-{len(active)}c"

    # Save to database
    db_response = Response(
        concept_id=concept_id,
        persona_id=persona.id if persona else 1,
        concept_name=request.concept,
        prompt_version=version_tag,
        prompt_text=full_prompt,
        response_text=ai_result["response_text"],
        difficulty=request.difficulty,
        length=request.length,
        latency_ms=ai_result["latency_ms"],
        is_demo=ai_result["is_demo"],
        timestamp=datetime.datetime.utcnow()
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)

    prompt_breakdown_obj = PromptBreakdown(
        system_role=breakdown_data["system_role"],
        persona=breakdown_data["persona"],
        tone=breakdown_data["tone"],
        format=breakdown_data["format"],
        context=breakdown_data["context"],
        examples=breakdown_data["examples"],
        instructions=breakdown_data["instructions"],
        user_concept=request.concept,
        full_prompt=full_prompt,
        active_components=breakdown_data["active_components"]
    )

    return ChatResponse(
        response_id=db_response.id,
        concept=request.concept,
        persona_slug=persona_slug,
        persona_name=persona_name,
        prompt_breakdown=prompt_breakdown_obj,
        response_text=ai_result["response_text"],
        latency_ms=ai_result["latency_ms"],
        is_demo=ai_result["is_demo"],
        timestamp=db_response.timestamp.isoformat()
    )


@router.post("/compare", response_model=CompareResponse)
async def compare_personas(request: CompareRequest, db: Session = Depends(get_db)):
    personas = db.query(Persona).all()
    if not personas:
        raise HTTPException(status_code=404, detail="No personas available")

    # Match concept
    concept_obj = db.query(Concept).filter(func.lower(Concept.name) == request.concept.lower()).first()

    comparisons = []
    matrix = {
        "Clarity": {},
        "Correctness": {},
        "Usefulness": {},
        "Engagement": {},
        "Persona Match": {},
        "Overall": {}
    }

    for p in personas:
        # Check if pre-existing baseline response exists for this concept
        existing_resp = None
        if concept_obj:
            existing_resp = db.query(Response).filter(
                Response.concept_id == concept_obj.id,
                Response.persona_id == p.id
            ).first()

        if existing_resp:
            resp_text = existing_resp.response_text
            prompt_res = build_modular_prompt(p.slug, request.concept, difficulty=request.difficulty, length=request.length)
            breakdown_data = prompt_res["breakdown"]
        else:
            prompt_res = build_modular_prompt(p.slug, request.concept, difficulty=request.difficulty, length=request.length)
            full_prompt = prompt_res["full_prompt"]
            breakdown_data = prompt_res["breakdown"]
            ai_res = await generate_explanation(
                prompt=full_prompt,
                concept=request.concept,
                persona_slug=p.slug,
                difficulty=request.difficulty,
                length=request.length,
                breakdown=breakdown_data
            )
            resp_text = ai_res["response_text"]

        # Calculate average ratings from database for this persona
        ratings_query = db.query(
            func.avg(Rating.clarity).label("clarity"),
            func.avg(Rating.correctness).label("correctness"),
            func.avg(Rating.usefulness).label("usefulness"),
            func.avg(Rating.engagement).label("engagement"),
            func.avg(Rating.persona_match).label("persona_match"),
            func.avg(Rating.overall_rating).label("overall")
        ).join(Response, Rating.response_id == Response.id).filter(Response.persona_id == p.id)

        if concept_obj:
            concept_ratings = ratings_query.filter(Response.concept_id == concept_obj.id).first()
        else:
            concept_ratings = None

        # Fallback to persona-level averages if no concept-specific ratings
        if not concept_ratings or concept_ratings.overall is None:
            concept_ratings = ratings_query.first()

        avg_ratings = {
            "clarity": round(float(concept_ratings.clarity or 4.4), 2),
            "correctness": round(float(concept_ratings.correctness or 4.5), 2),
            "usefulness": round(float(concept_ratings.usefulness or 4.3), 2),
            "engagement": round(float(concept_ratings.engagement or 4.2), 2),
            "persona_match": round(float(concept_ratings.persona_match or 4.6), 2),
            "overall": round(float(concept_ratings.overall or 4.4), 2)
        }

        # Populate matrix
        matrix["Clarity"][p.name] = avg_ratings["clarity"]
        matrix["Correctness"][p.name] = avg_ratings["correctness"]
        matrix["Usefulness"][p.name] = avg_ratings["usefulness"]
        matrix["Engagement"][p.name] = avg_ratings["engagement"]
        matrix["Persona Match"][p.name] = avg_ratings["persona_match"]
        matrix["Overall"][p.name] = avg_ratings["overall"]

        prompt_breakdown_obj = PromptBreakdown(
            system_role=breakdown_data["system_role"],
            persona=breakdown_data["persona"],
            tone=breakdown_data["tone"],
            format=breakdown_data["format"],
            context=breakdown_data["context"],
            examples=breakdown_data["examples"],
            instructions=breakdown_data["instructions"],
            user_concept=request.concept,
            full_prompt=breakdown_data["full_prompt"],
            active_components=breakdown_data["active_components"]
        )

        comparisons.append(SinglePersonaComparison(
            persona_slug=p.slug,
            persona_name=p.name,
            tagline=p.tagline,
            response_text=resp_text,
            prompt_breakdown=prompt_breakdown_obj,
            average_ratings=avg_ratings
        ))

    return CompareResponse(
        concept=request.concept,
        comparisons=comparisons,
        matrix=matrix
    )
