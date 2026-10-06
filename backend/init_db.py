"""
Database Initialization Script for Persona-Based Explanation Chatbot.
Creates tables and seeds default 20-concept benchmark with 5 personas,
100 baseline experiments, 16 student evaluators, and ablation baselines.
"""

from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database

def main():
    print("Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        print("Checking & seeding benchmark dataset...")
        res = seed_database(db, force=False)
        print("Seed result:", res)
        print("Database initialization complete! Database ready at persona_chatbot.db")
    finally:
        db.close()

if __name__ == "__main__":
    main()
