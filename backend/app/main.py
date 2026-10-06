from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal, Base
from app.seed_data import seed_database
from app.routes import concepts, chat, experiments, ratings, ablation, analytics, export, settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema
    Base.metadata.create_all(bind=engine)
    # Seed default dataset if database is empty
    db = SessionLocal()
    try:
        seed_database(db, force=False)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Persona-Based Explanation Chatbot API",
    description="Educational AI platform demonstrating prompt engineering, persona comparison, and ablation studies.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(concepts.router)
app.include_router(chat.router)
app.include_router(experiments.router)
app.include_router(ratings.router)
app.include_router(ablation.router)
app.include_router(analytics.router)
app.include_router(export.router)
app.include_router(settings.router)

@app.get("/")
def root():
    return {
        "project": "Persona-Based Explanation Chatbot",
        "subtitle": "Prompt Engineering in Practice",
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
