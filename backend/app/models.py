import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Concept(Base):
    __tablename__ = "concepts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)  # DBMS, OS, Networks, OOP, AI/ML, Cloud & Security, DSA
    difficulty = Column(String(50), default="Intermediate")

    responses = relationship("Response", back_populates="concept", cascade="all, delete-orphan")
    ablation_tests = relationship("AblationTest", back_populates="concept", cascade="all, delete-orphan")


class Persona(Base):
    __tablename__ = "personas"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False)  # examiner, friendly_senior, child_friendly, real_world_analogy, exam_answer
    name = Column(String(100), nullable=False)
    tagline = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    role = Column(Text, nullable=False)
    tone = Column(Text, nullable=False)
    format = Column(Text, nullable=False)
    example_text = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)

    templates = relationship("PromptTemplate", back_populates="persona", cascade="all, delete-orphan")
    responses = relationship("Response", back_populates="persona", cascade="all, delete-orphan")
    ablation_tests = relationship("AblationTest", back_populates="persona", cascade="all, delete-orphan")


class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True, index=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    role = Column(Text, nullable=False)
    tone = Column(Text, nullable=False)
    format = Column(Text, nullable=False)
    examples = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    is_default = Column(Boolean, default=True)

    persona = relationship("Persona", back_populates="templates")


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    concept_name = Column(String(200), nullable=False)
    prompt_version = Column(String(50), default="v1.0-full")
    prompt_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    length = Column(String(50), default="Medium")
    latency_ms = Column(Integer, default=240)
    is_demo = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    concept = relationship("Concept", back_populates="responses")
    persona = relationship("Persona", back_populates="responses")
    ratings = relationship("Rating", back_populates="response", cascade="all, delete-orphan")


class Evaluator(Base):
    __tablename__ = "evaluators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    student_id = Column(String(50), nullable=True)
    batch = Column(String(50), default="2023-2027")
    department = Column(String(100), default="CSE / AI-ML")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ratings = relationship("Rating", back_populates="evaluator", cascade="all, delete-orphan")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False)
    evaluator_id = Column(Integer, ForeignKey("evaluators.id"), nullable=False)
    clarity = Column(Float, nullable=False)       # 1 - 5
    correctness = Column(Float, nullable=False)   # 1 - 5
    usefulness = Column(Float, nullable=False)    # 1 - 5
    engagement = Column(Float, nullable=False)    # 1 - 5
    persona_match = Column(Float, nullable=False) # 1 - 5
    overall_rating = Column(Float, nullable=False)# Average of above 5
    comments_like = Column(Text, nullable=True)
    comments_improve = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    response = relationship("Response", back_populates="ratings")
    evaluator = relationship("Evaluator", back_populates="ratings")


class AblationTest(Base):
    __tablename__ = "ablation_tests"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), nullable=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    concept_name = Column(String(200), nullable=False)
    configuration = Column(String(50), nullable=False)  # full, no_role, no_tone, no_format, no_examples, no_instructions, minimal
    prompt_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    clarity = Column(Float, nullable=False)
    correctness = Column(Float, nullable=False)
    usefulness = Column(Float, nullable=False)
    engagement = Column(Float, nullable=False)
    persona_match = Column(Float, nullable=False)
    overall_score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    concept = relationship("Concept", back_populates="ablation_tests")
    persona = relationship("Persona", back_populates="ablation_tests")
