"""
Standalone Demo Data Reset & Seeder Script.
Forces re-population of standard 20 concepts, 5 personas, 100 baseline explanations,
16 classmate evaluators, and ablation study permutations.
"""

from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database

def main():
    print("Re-seeding standard Demo Dataset...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        res = seed_database(db, force=True)
        print("Reset & Seed result:", res)
        print("Demo Dataset restored successfully with 20 concepts, 100 baseline experiments, and 16 student evaluators.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
