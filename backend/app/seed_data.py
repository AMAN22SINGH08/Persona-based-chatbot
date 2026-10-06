import random
import datetime
from sqlalchemy.orm import Session
from app.models import Concept, Persona, PromptTemplate, Response, Evaluator, Rating, AblationTest
from app.knowledge_base import CONCEPTS_LIST, generate_academic_baseline
from app.prompt_engine import PERSONA_DEFINITIONS, ABLATION_CONFIGURATIONS, build_modular_prompt

STUDENT_EVALUATORS = [
    {"name": "Aarav Sharma", "student_id": "21BCSE101", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Ananya Verma", "student_id": "21BAIML042", "batch": "2021-2025", "department": "AI & Machine Learning"},
    {"name": "Rohan Patel", "student_id": "22BCSE088", "batch": "2022-2026", "department": "Computer Science & Engineering"},
    {"name": "Priya Sundaram", "student_id": "21BCSE154", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Vikram Malhotra", "student_id": "21BAIML019", "batch": "2021-2025", "department": "AI & Machine Learning"},
    {"name": "Neha Gupta", "student_id": "22BCSE204", "batch": "2022-2026", "department": "Computer Science & Engineering"},
    {"name": "Aditya Iyer", "student_id": "21BCSE033", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Sneha Rao", "student_id": "22BAIML067", "batch": "2022-2026", "department": "AI & Machine Learning"},
    {"name": "Kabir Mehta", "student_id": "21BCSE112", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Divya Nair", "student_id": "22BCSE045", "batch": "2022-2026", "department": "Computer Science & Engineering"},
    {"name": "Arjun Deshmukh", "student_id": "21BAIML081", "batch": "2021-2025", "department": "AI & Machine Learning"},
    {"name": "Pooja Kulkarni", "student_id": "22BCSE178", "batch": "2022-2026", "department": "Computer Science & Engineering"},
    {"name": "Rishabh Singhal", "student_id": "21BCSE099", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Tanvi Saxena", "student_id": "22BAIML029", "batch": "2022-2026", "department": "AI & Machine Learning"},
    {"name": "Siddharth Reddy", "student_id": "21BCSE165", "batch": "2021-2025", "department": "Computer Science & Engineering"},
    {"name": "Meera Joshi", "student_id": "22BCSE110", "batch": "2022-2026", "department": "Computer Science & Engineering"}
]

SAMPLE_FEEDBACK = {
    "examiner": {
        "likes": [
            "Formal structure directly aligns with our university exam syllabus.",
            "Technical terminology and definitions are pinpoint accurate.",
            "High marks guidance helped clarify marking scheme expectations.",
            "The division of advantages and disadvantages was concise and thorough."
        ],
        "improves": [
            "Could include a bit more intuitive explanation before jumping into formal definitions.",
            "A bit dense for initial conceptual understanding, but great for revision.",
            "Can add quick visual diagrams or ASCII charts."
        ]
    },
    "friendly_senior": {
        "likes": [
            "Super relatable peer tone! Felt like asking a senior over coffee in the canteen.",
            "The placement interview pro-tips were incredibly useful.",
            "Removed all unnecessary textbook jargon while keeping the core logic intact.",
            "The hostel/real-life analogies made it click immediately."
        ],
        "improves": [
            "Could add more mathematical equations for semester exam write-ups.",
            "A bit casual for official homework submissions, but great for learning.",
            "Add a quick bullet summary at the very end."
        ]
    },
    "child_friendly": {
        "likes": [
            "The toy box story was brilliant for building mental intuition!",
            "Made a difficult abstract concept feel effortless to understand.",
            "Engaging and fun language, loved the mini-quiz at the end.",
            "Great for complete beginners who get intimidated by technical jargon."
        ],
        "improves": [
            "Omitted technical names that professors look for in university exams.",
            "Too playful for direct college exam answers, though awesome for intuition.",
            "Could bridge back to real programming terms at the end."
        ]
    },
    "real_world_analogy": {
        "likes": [
            "The explicit mapping table between real-world items and CS concepts was amazing!",
            "Explaining where the analogy breaks down is a masterclass in honest teaching.",
            "Helped visualize physical flows and resource bottlenecks intuitively.",
            "Made it easy to explain this concept in viva presentations."
        ],
        "improves": [
            "Some boundary edge cases could be expanded further.",
            "Make the initial technical introduction slightly longer before the metaphor.",
            "Could include a code snippet alongside the analogy mapping."
        ]
    },
    "exam_answer": {
        "likes": [
            "The 2-mark, 5-mark, and 10-mark breakdowns are absolute gold for exam prep!",
            "Saves hours of structuring textbook notes before university exams.",
            "Directly memorizable with clean headings and bullet points.",
            "Excellent coverage of definitions, architecture, and trade-offs."
        ],
        "improves": [
            "A bit text-heavy, but matches university paper requirements.",
            "Could include code syntax for the 5-mark answer.",
            "Can add tips for drawing the flowchart quickly in the exam hall."
        ]
    }
}

def seed_database(db: Session, force: bool = False):
    # Check if concepts already seeded
    existing_concepts_count = db.query(Concept).count()
    if existing_concepts_count >= 20 and not force:
        return {"status": "already_seeded", "concepts": existing_concepts_count}

    if force:
        # Clear existing tables
        db.query(Rating).delete()
        db.query(AblationTest).delete()
        db.query(Response).delete()
        db.query(PromptTemplate).delete()
        db.query(Evaluator).delete()
        db.query(Persona).delete()
        db.query(Concept).delete()
        db.commit()

    random.seed(42)  # Deterministic seed for reproducible evaluation data

    # 1. Seed Personas
    persona_map = {}
    for slug, p_data in PERSONA_DEFINITIONS.items():
        persona = Persona(
            slug=slug,
            name=p_data["name"],
            tagline=p_data["tagline"],
            description=p_data["description"],
            role=p_data["role"],
            tone=p_data["tone"],
            format=p_data["format"],
            example_text=p_data["examples"],
            instructions=p_data["instructions"]
        )
        db.add(persona)
        db.flush()
        persona_map[slug] = persona

        # Add PromptTemplate
        template = PromptTemplate(
            persona_id=persona.id,
            role=p_data["role"],
            tone=p_data["tone"],
            format=p_data["format"],
            examples=p_data["examples"],
            instructions=p_data["instructions"],
            is_default=True
        )
        db.add(template)

    # 2. Seed Concepts
    concept_map = {}
    for c_data in CONCEPTS_LIST:
        concept = Concept(
            slug=c_data["slug"],
            name=c_data["name"],
            description=c_data["description"],
            category=c_data["category"],
            difficulty=c_data["difficulty"]
        )
        db.add(concept)
        db.flush()
        concept_map[c_data["slug"]] = concept

    # 3. Seed 100 Responses (20 concepts x 5 personas)
    responses_list = []
    base_time = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    
    for concept in concept_map.values():
        for slug, persona in persona_map.items():
            prompt_res = build_modular_prompt(slug, concept.name, difficulty=concept.difficulty, length="Medium")
            full_prompt = prompt_res["full_prompt"]
            response_text = generate_academic_baseline(concept.name, slug, difficulty=concept.difficulty, length="Medium")
            
            resp = Response(
                concept_id=concept.id,
                persona_id=persona.id,
                concept_name=concept.name,
                prompt_version="v1.0-full",
                prompt_text=full_prompt,
                response_text=response_text,
                difficulty=concept.difficulty,
                length="Medium",
                latency_ms=random.randint(180, 420),
                is_demo=True,
                timestamp=base_time + datetime.timedelta(hours=random.randint(1, 100))
            )
            db.add(resp)
            db.flush()
            responses_list.append((resp, slug))

    # 4. Seed 16 Evaluators (Classmates)
    evaluator_objects = []
    for ev_data in STUDENT_EVALUATORS:
        ev = Evaluator(
            name=ev_data["name"],
            student_id=ev_data["student_id"],
            batch=ev_data["batch"],
            department=ev_data["department"],
            created_at=base_time + datetime.timedelta(hours=random.randint(1, 24))
        )
        db.add(ev)
        db.flush()
        evaluator_objects.append(ev)

    # 5. Seed Realistic Ratings (each evaluator reviews 5-8 explanations)
    rating_profiles = {
        "examiner": {"clarity": (4.2, 4.8), "correctness": (4.6, 5.0), "usefulness": (4.1, 4.7), "engagement": (3.5, 4.2), "match": (4.5, 5.0)},
        "friendly_senior": {"clarity": (4.4, 5.0), "correctness": (4.2, 4.7), "usefulness": (4.5, 5.0), "engagement": (4.5, 5.0), "match": (4.6, 5.0)},
        "child_friendly": {"clarity": (4.3, 4.9), "correctness": (3.9, 4.4), "usefulness": (3.6, 4.3), "engagement": (4.7, 5.0), "match": (4.8, 5.0)},
        "real_world_analogy": {"clarity": (4.4, 4.9), "correctness": (4.3, 4.8), "usefulness": (4.4, 4.9), "engagement": (4.6, 5.0), "match": (4.5, 4.9)},
        "exam_answer": {"clarity": (4.5, 5.0), "correctness": (4.7, 5.0), "usefulness": (4.8, 5.0), "engagement": (3.8, 4.4), "match": (4.7, 5.0)}
    }

    for ev in evaluator_objects:
        # Each student reviews a sample of 6 responses across distinct concepts/personas
        sampled_responses = random.sample(responses_list, k=7)
        for resp, p_slug in sampled_responses:
            prof = rating_profiles[p_slug]
            clarity = round(random.uniform(*prof["clarity"]), 1)
            correctness = round(random.uniform(*prof["correctness"]), 1)
            usefulness = round(random.uniform(*prof["usefulness"]), 1)
            engagement = round(random.uniform(*prof["engagement"]), 1)
            match = round(random.uniform(*prof["match"]), 1)
            overall = round((clarity + correctness + usefulness + engagement + match) / 5.0, 2)
            
            fb = SAMPLE_FEEDBACK[p_slug]
            like_comment = random.choice(fb["likes"])
            improve_comment = random.choice(fb["improves"])

            rating = Rating(
                response_id=resp.id,
                evaluator_id=ev.id,
                clarity=clarity,
                correctness=correctness,
                usefulness=usefulness,
                engagement=engagement,
                persona_match=match,
                overall_rating=overall,
                comments_like=like_comment,
                comments_improve=improve_comment,
                timestamp=resp.timestamp + datetime.timedelta(hours=random.randint(2, 48))
            )
            db.add(rating)

    # 6. Seed Ablation Study Data across 7 configurations
    # Configurations: full, no_role, no_tone, no_format, no_examples, no_instructions, minimal
    ablation_baselines = {
        "full": {"clarity": 4.65, "correctness": 4.75, "usefulness": 4.70, "engagement": 4.55, "persona_match": 4.80},
        "no_role": {"clarity": 4.30, "correctness": 4.60, "usefulness": 4.25, "engagement": 3.90, "persona_match": 3.40},
        "no_tone": {"clarity": 4.35, "correctness": 4.65, "usefulness": 4.20, "engagement": 3.50, "persona_match": 3.85},
        "no_format": {"clarity": 3.45, "correctness": 4.50, "usefulness": 3.30, "engagement": 3.20, "persona_match": 4.10},
        "no_examples": {"clarity": 4.25, "correctness": 4.60, "usefulness": 4.35, "engagement": 4.15, "persona_match": 4.20},
        "no_instructions": {"clarity": 4.10, "correctness": 4.20, "usefulness": 3.95, "engagement": 4.05, "persona_match": 4.30},
        "minimal": {"clarity": 2.80, "correctness": 3.40, "usefulness": 2.50, "engagement": 2.20, "persona_match": 2.10}
    }

    test_concepts = list(concept_map.values())[:6] # 6 key concepts tested across ablation configurations
    for concept in test_concepts:
        for p_slug, persona in persona_map.items():
            for cfg_key, cfg_meta in ABLATION_CONFIGURATIONS.items():
                prompt_res = build_modular_prompt(
                    p_slug,
                    concept.name,
                    include_role=cfg_meta["include_role"],
                    include_tone=cfg_meta["include_tone"],
                    include_format=cfg_meta["include_format"],
                    include_examples=cfg_meta["include_examples"],
                    include_instructions=cfg_meta["include_instructions"]
                )
                
                # Jitter scores slightly around baseline
                base = ablation_baselines[cfg_key]
                c_score = round(min(5.0, max(1.0, base["clarity"] + random.uniform(-0.15, 0.15))), 1)
                cor_score = round(min(5.0, max(1.0, base["correctness"] + random.uniform(-0.15, 0.15))), 1)
                u_score = round(min(5.0, max(1.0, base["usefulness"] + random.uniform(-0.15, 0.15))), 1)
                e_score = round(min(5.0, max(1.0, base["engagement"] + random.uniform(-0.15, 0.15))), 1)
                m_score = round(min(5.0, max(1.0, base["persona_match"] + random.uniform(-0.15, 0.15))), 1)
                ov_score = round((c_score + cor_score + u_score + e_score + m_score) / 5.0, 2)
                
                simulated_resp_text = generate_academic_baseline(concept.name, p_slug)
                if cfg_key == "minimal":
                    simulated_resp_text = f"{concept.name} is a core computer science topic. It provides standard methods to process data and control systems."
                elif cfg_key == "no_format":
                    simulated_resp_text = simulated_resp_text.replace("### ", "").replace("- **", "").replace("**", "")

                ab_test = AblationTest(
                    concept_id=concept.id,
                    persona_id=persona.id,
                    concept_name=concept.name,
                    configuration=cfg_key,
                    prompt_text=prompt_res["full_prompt"],
                    response_text=simulated_resp_text,
                    clarity=c_score,
                    correctness=cor_score,
                    usefulness=u_score,
                    engagement=e_score,
                    persona_match=m_score,
                    overall_score=ov_score,
                    timestamp=base_time + datetime.timedelta(hours=random.randint(5, 120))
                )
                db.add(ab_test)

    db.commit()
    return {
        "status": "seeded_successfully",
        "concepts_count": len(concept_map),
        "personas_count": len(persona_map),
        "responses_count": len(responses_list),
        "evaluators_count": len(evaluator_objects)
    }
