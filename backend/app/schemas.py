from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime

class ConceptBase(BaseModel):
    slug: str
    name: str
    description: str
    category: str
    difficulty: str = "Intermediate"

class ConceptOut(ConceptBase):
    id: int
    class Config:
        from_attributes = True

class PersonaBase(BaseModel):
    slug: str
    name: str
    tagline: str
    description: str
    role: str
    tone: str
    format: str
    example_text: str
    instructions: str

class PersonaOut(PersonaBase):
    id: int
    class Config:
        from_attributes = True

class PromptBreakdown(BaseModel):
    system_role: Optional[str] = None
    persona: Optional[str] = None
    tone: Optional[str] = None
    format: Optional[str] = None
    context: Optional[str] = None
    examples: Optional[str] = None
    instructions: Optional[str] = None
    user_concept: str
    full_prompt: str
    active_components: List[str]

class ChatRequest(BaseModel):
    concept: str
    persona_slug: str = "examiner"
    difficulty: str = "Intermediate"  # Beginner, Intermediate, Advanced
    length: str = "Medium"            # Short, Medium, Detailed
    # Component toggles for playground / ablation
    include_role: bool = True
    include_tone: bool = True
    include_format: bool = True
    include_examples: bool = True
    include_instructions: bool = True

class ChatResponse(BaseModel):
    response_id: Optional[int] = None
    concept: str
    persona_slug: str
    persona_name: str
    prompt_breakdown: PromptBreakdown
    response_text: str
    latency_ms: int
    is_demo: bool
    timestamp: str

class CompareRequest(BaseModel):
    concept: str
    difficulty: str = "Intermediate"
    length: str = "Medium"

class SinglePersonaComparison(BaseModel):
    persona_slug: str
    persona_name: str
    tagline: str
    response_text: str
    prompt_breakdown: PromptBreakdown
    average_ratings: Optional[Dict[str, float]] = None

class CompareResponse(BaseModel):
    concept: str
    comparisons: List[SinglePersonaComparison]
    matrix: Dict[str, Dict[str, float]]  # criteria -> persona -> avg_score

class EvaluatorCreate(BaseModel):
    name: str
    student_id: Optional[str] = None
    batch: Optional[str] = "2023-2027"
    department: Optional[str] = "CSE / AI-ML"

class EvaluatorOut(BaseModel):
    id: int
    name: str
    student_id: Optional[str]
    batch: str
    department: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class RatingCreate(BaseModel):
    response_id: int
    evaluator_name: str
    evaluator_id: Optional[int] = None
    student_id: Optional[str] = None
    clarity: float = Field(..., ge=1.0, le=5.0)
    correctness: float = Field(..., ge=1.0, le=5.0)
    usefulness: float = Field(..., ge=1.0, le=5.0)
    engagement: float = Field(..., ge=1.0, le=5.0)
    persona_match: float = Field(..., ge=1.0, le=5.0)
    comments_like: Optional[str] = ""
    comments_improve: Optional[str] = ""

class RatingOut(BaseModel):
    id: int
    response_id: int
    concept_name: Optional[str] = None
    persona_name: Optional[str] = None
    evaluator_name: str
    clarity: float
    correctness: float
    usefulness: float
    engagement: float
    persona_match: float
    overall_rating: float
    comments_like: Optional[str]
    comments_improve: Optional[str]
    timestamp: datetime.datetime
    class Config:
        from_attributes = True

class ExperimentOut(BaseModel):
    id: int
    concept_id: Optional[int]
    concept_name: str
    category: str
    persona_slug: str
    persona_name: str
    prompt_version: str
    prompt_text: str
    response_text: str
    difficulty: str
    length: str
    latency_ms: int
    is_demo: bool
    rating_count: int
    average_rating: float
    criteria_scores: Dict[str, float]
    timestamp: datetime.datetime

class AblationRunRequest(BaseModel):
    concept: str
    persona_slug: str = "examiner"
    configuration: str = "full"  # full, no_role, no_tone, no_format, no_examples, no_instructions, minimal

class AblationTestOut(BaseModel):
    id: int
    concept_name: str
    persona_slug: str
    persona_name: str
    configuration: str
    config_label: str
    prompt_text: str
    response_text: str
    clarity: float
    correctness: float
    usefulness: float
    engagement: float
    persona_match: float
    overall_score: float
    timestamp: datetime.datetime

class AblationSummary(BaseModel):
    configuration: str
    config_label: str
    description: str
    test_count: int
    avg_clarity: float
    avg_correctness: float
    avg_usefulness: float
    avg_engagement: float
    avg_persona_match: float
    avg_overall: float
    delta_from_full: float

class AnalyticsDashboard(BaseModel):
    total_concepts: int
    total_personas: int
    total_experiments: int
    total_evaluators: int
    total_ratings: int
    overall_average_score: float
    best_performing_persona: str
    best_performing_persona_score: float
    best_prompt_config: str
    most_important_prompt_element: str
    most_important_element_delta: float
    persona_scores: List[Dict[str, Any]]
    ablation_scores: List[Dict[str, Any]]
    radar_data: List[Dict[str, Any]]
    category_scores: List[Dict[str, Any]]
    difficulty_scores: List[Dict[str, Any]]

class SettingsUpdate(BaseModel):
    openai_api_key: Optional[str] = None
    openai_base_url: Optional[str] = None
    openai_model: Optional[str] = None
    demo_mode: Optional[bool] = None

class SettingsOut(BaseModel):
    has_api_key: bool
    openai_base_url: str
    openai_model: str
    is_demo_mode: bool
