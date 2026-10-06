# Persona-Based Explanation Chatbot
> **Subtitle:** *Prompt Engineering in Practice*  
> **Course / Degree:** BTech Computer Science & Engineering / AI-ML Project  
> **Domain:** Applied Natural Language Processing, Prompt Engineering & Educational AI  

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20+%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Status](https://img.shields.io/badge/Status-Portfolio--Ready-success.svg)]()

---

> [!IMPORTANT]
> **STUDENT RESEARCH & EDUCATIONAL DISCLAIMER**  
> This project is an undergraduate student research and educational demonstration designed to demonstrate practical prompt engineering and empirical ablation methodology. It is **not** presented as a clinically or psychometrically standardized psycholinguistic AI evaluation system.

---

## 📖 Project Objective

The objective of this project is to build an educational AI platform that explains technical computer science concepts using distinct educational personas, driven by a modular prompt architecture. Rather than relying on superficial UI modifications or unengineered zero-shot queries, the application implements structured prompt templates, a 20-concept benchmark ($20 \times 5 = 100$ explanations), a peer evaluation system supporting ratings from 15+ student classmates, and a 7-configuration ablation study that measures the quantitative impact of individual prompt components.

---

## 📐 Modular Prompt Architecture

Prompt assembly follows a rigorous 8-stage modular synthesis pipeline:

$$\text{Prompt} = \text{System Role} \oplus \text{Persona} \oplus \text{Tone} \oplus \text{Format} \oplus \text{Context} \oplus \text{Examples} \oplus \text{Instructions} \oplus \text{User Concept}$$

```
┌────────────────────────────────────────────────────────┐
│ [ROLE]                   Persona identity & expertise  │
├────────────────────────────────────────────────────────┤
│ [TONE & STYLE]           Pedagogical & linguistic voice│
├────────────────────────────────────────────────────────┤
│ [OUTPUT FORMAT]          Structural layout constraints │
├────────────────────────────────────────────────────────┤
│ [CONTEXT & CONSTRAINTS]  Difficulty level & length     │
├────────────────────────────────────────────────────────┤
│ [FEW-SHOT EXAMPLES]      Phrasing demonstrations       │
├────────────────────────────────────────────────────────┤
│ [STEP-BY-STEP GUIDELINES]Scaffolded explanation path   │
├────────────────────────────────────────────────────────┤
│ [USER CONCEPT]           Target technical concept      │
└────────────────────────────────────────────────────────┘
```

The application provides a **Prompt Inspector** allowing students to dissect and view how each prompt module contributes to the final LLM prompt.

---

## 🎭 The 5 Educational Personas

| # | Persona | Pedagogical Strategy | Stylistic Characteristics |
|---|---|---|---|
| **1** | **Examiner** | University Syllabus & Evaluation | High academic rigor, formal definitions, advantages/disadvantages, exam caveats, and common candidate pitfalls. |
| **2** | **Friendly Senior** | Peer Mentorship & Placement Prep | Conversational peer tone, zero textbook jargon, practical placement interview hacks, and campus-relatable examples. |
| **3** | **Child-Friendly** | Story-Driven Conceptual Intuition | Extremely simple vocabulary, playful toy-box metaphors, colorful real-world scenarios, and mini-quizzes. |
| **4** | **Real-World Analogy** | Structural Mapping & Mental Models | Concrete physical system metaphors with explicit component-to-concept mapping tables and boundary limitation analysis. |
| **5** | **Exam-Answer Format** | High-Scoring University Rubrics | Strict mark allocation format: 2-mark concise definitions, 5-mark structured answers, and 10-mark essay blueprints. |

---

## 🧪 20 Predefined Concepts Benchmark

The benchmark comprises exactly 20 core BTech CSE / AI-ML subjects, evaluated across all 5 personas ($20 \times 5 = 100$ baseline experiments):

1. **DBMS Normalization** *(Databases)*
2. **Primary Key vs Foreign Key** *(Databases)*
3. **Operating System Process** *(Operating Systems)*
4. **Deadlock** *(Operating Systems)*
5. **Computer Network** *(Networking)*
6. **OSI Model** *(Networking)*
7. **TCP/IP Protocol Suite** *(Networking)*
8. **Data Structures** *(DSA)*
9. **Binary Search** *(DSA)*
10. **Object-Oriented Programming** *(Software Engineering)*
11. **Inheritance** *(Software Engineering)*
12. **Polymorphism** *(Software Engineering)*
13. **Machine Learning** *(AI/ML)*
14. **Supervised Learning** *(AI/ML)*
15. **Neural Network** *(AI/ML)*
16. **Overfitting** *(AI/ML)*
17. **Artificial Intelligence** *(AI/ML)*
18. **SQL JOIN** *(Databases)*
19. **Cloud Computing** *(Cloud & Systems)*
20. **Cybersecurity** *(Security)*

---

## 🔬 The Ablation Study

The ablation study isolates prompt elements to determine which components most strongly drive output quality.

### The 7 Evaluated Configurations:
- **A. Full Modular Prompt**: Role + Tone + Format + Examples + Instructions *(Baseline)*
- **B. Without Role**: Removes persona identity; measures stylistic anchoring.
- **C. Without Tone**: Removes voice guidance; measures engagement & empathy.
- **D. Without Format**: Removes structural rules; measures visual readability & organization.
- **E. Without Examples**: Removes few-shot demonstrations; measures few-shot consistency.
- **F. Without Instructions**: Removes step-by-step guidelines; measures procedural clarity.
- **G. Minimal Prompt**: Only raw concept query (`Explain {concept}`); simulates unengineered zero-shot usage.

### Key Empirical Findings:
1. **Format Constraint is Paramount:** Removing output formatting caused the largest quality drop ($\Delta -0.85$ points), proving students heavily penalize unformatted wall-of-text explanations.
2. **Tone Dictates Engagement:** Removing tone instructions reduced engagement from $4.55$ to $3.50$, specifically damaging Friendly Senior and Child-Friendly styles.
3. **Minimal Prompts Collapse:** Unengineered queries achieved an overall score of only $2.60/5$, exhibiting generic, unguided text lacking pedagogical utility.

---

## ⭐ Student Evaluation & Rating System

The evaluation rubric assesses explanations on a 1–5 Likert scale across five dimensions:

1. **Clarity (1–5):** Readability, structure, and cognitive accessibility.
2. **Correctness (1–5):** Factuality, technical soundness, and academic accuracy.
3. **Usefulness (1–5):** Practical exam and viva revision utility.
4. **Engagement (1–5):** Pedagogical interest, tone, and relatability.
5. **Persona Match (1–5):** Alignment with the intended stylistic role.
- **Overall Rating:** $\text{Average of all 5 criteria} = \frac{\text{Clarity} + \text{Correctness} + \text{Usefulness} + \text{Engagement} + \text{Match}}{5}$.
- **Qualitative Feedback:** *"What did you like?"* and *"What could be improved?"*

The system comes pre-seeded with **16 named classmate evaluators** from BTech CSE/AI-ML, while enabling new classmates to submit live reviews without account registration.

---

## 🛠️ Project Directory Structure

```
persona-explanation-chatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app initialization, CORS & lifespan
│   │   ├── config.py            # Environment configuration & demo detection
│   │   ├── database.py          # SQLAlchemy database engine & sessionmaker
│   │   ├── models.py            # ORM models (Concept, Persona, Response, Rating, etc.)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── prompt_engine.py     # Modular prompt builder & ablation presets
│   │   ├── knowledge_base.py    # Curated academic explanations for 20 concepts
│   │   ├── ai_service.py        # OpenAI async client + Academic Engine fallback
│   │   ├── seed_data.py         # 20 concepts, 100 baseline tests, 16 evaluators
│   │   └── routes/
│   │       ├── chat.py          # /api/chat, /api/compare
│   │       ├── concepts.py      # /api/concepts, /api/personas
│   │       ├── experiments.py   # /api/experiments
│   │       ├── ratings.py       # /api/ratings, /api/evaluators
│   │       ├── ablation.py      # /api/ablation, /api/ablation/run
│   │       ├── analytics.py     # /api/analytics
│   │       ├── export.py        # /api/export/* (CSV streams)
│   │       └── settings.py      # /api/settings, dataset reset controls
│   ├── init_db.py               # Database setup script
│   ├── seed_demo.py             # Demo data reset script
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   └── run.py                   # Uvicorn server launcher
├── frontend/
│   ├── package.json             # NPM dependencies (React 18, Recharts, Lucide)
│   ├── vite.config.js           # Vite config with backend proxy
│   ├── tailwind.config.js       # Tailwind CSS theme
│   ├── postcss.config.js        # PostCSS setup
│   ├── index.html               # Main HTML entry
│   └── src/
│       ├── main.jsx             # React entrypoint
│       ├── App.jsx              # React Router setup (10 pages)
│       ├── index.css            # Tailwind directives & print styles
│       ├── api.js               # Unified API client
│       ├── components/
│       │   ├── Layout.jsx       # Sidebar navigation & disclaimer banner
│       │   ├── MetricCard.jsx   # Metric stats card
│       │   ├── PromptInspector.jsx # Modular prompt breakdown modal
│       │   ├── RatingModal.jsx  # 5-criteria classmate evaluation modal
│       │   └── StarRating.jsx   # Interactive 1-5 star selector
│       └── pages/
│           ├── Dashboard.jsx    # Metrics, persona spotlights, formula
│           ├── Chatbot.jsx      # Interactive chat with difficulty/length
│           ├── ComparePersonas.jsx # 5 personas side-by-side & matrix
│           ├── ExperimentTable.jsx # 100-test experiment viewer & filters
│           ├── PromptPlayground.jsx # Component toggles & live preview
│           ├── AblationStudy.jsx # 7 configurations, Recharts bar/radar
│           ├── RatingsPage.jsx  # Student evaluation form & ratings log
│           ├── AnalyticsPage.jsx # Multi-criteria charts & distributions
│           ├── ResearchSummary.jsx # Formal academic report (Print/PDF)
│           └── SettingsPage.jsx # API keys, demo toggle & CSV exports
└── README.md                    # Project documentation
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** v18 or higher (tested on Node v24)
- **NPM:** v9 or higher

---

### Step 1: Backend Setup

1. Open a terminal in the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the SQLite database and seed the 100 baseline experiments:
   ```bash
   python init_db.py
   ```

5. (Optional) Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: If no API key is set, the application operates automatically in offline **Academic Demo Mode**, providing curated responses for all 20 predefined concepts and dynamic synthetic explanations for novel concepts.*

6. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   The backend will be running at `http://localhost:8000`.  
   Interactive API documentation (Swagger UI) is accessible at `http://localhost:8000/docs`.

---

### Step 2: Frontend Setup

1. Open a new terminal in the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 📡 API Documentation & Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/concepts` | Returns all 20 predefined BTech CSE concepts. |
| `GET` | `/api/personas` | Returns all 5 educational personas and template definitions. |
| `POST` | `/api/chat` | Generates persona explanation and saves response to database. |
| `POST` | `/api/compare` | Compares all 5 personas side-by-side for a target concept. |
| `GET` | `/api/experiments` | Returns 100 benchmark experiment records with filters. |
| `GET` | `/api/ratings` | Lists student evaluation rubrics and classmate feedback. |
| `POST` | `/api/ratings` | Submits a new 5-criteria student evaluation. |
| `GET` | `/api/evaluators` | Lists all classmate evaluator profiles. |
| `GET` | `/api/ablation/summary` | Aggregated metrics for the 7 ablation configurations. |
| `POST` | `/api/ablation/run` | Executes an ablation test dynamically on any concept/persona. |
| `GET` | `/api/analytics` | Dynamic dashboard statistics, radar data, and category scores. |
| `GET` | `/api/export/ratings` | Exports all student evaluation ratings as a downloadable CSV. |
| `GET` | `/api/export/experiments`| Exports 100-concept benchmark results as a downloadable CSV. |
| `GET` | `/api/export/ablation` | Exports ablation study matrix as a downloadable CSV. |
| `POST` | `/api/settings/reset-demo` | Restores database to standard 100-test Demo Dataset. |
| `POST` | `/api/settings/fresh-experiment` | Clears student ratings for live classroom evaluation. |

---

## 👥 How to Collect Ratings from 15 Classmates

1. Start both the backend and frontend on your laptop or local network.
2. Navigate to the **Student Ratings** page (`/ratings`) or click **Rate** from any chat card.
3. Have your classmate select their name from the **Evaluator Profile** dropdown (or enter a new name).
4. Select the target concept and persona they tested.
5. Provide ratings from 1 to 5 for **Clarity**, **Correctness**, **Usefulness**, **Engagement**, and **Persona Match**.
6. (Optional) Provide comments on what they liked and what could be improved.
7. Click **Submit Evaluation**. The overall score and dashboard analytics will update dynamically in real time.

---

## 🔄 How to Replace Demo Data with Real Classroom Data

1. Open the application and navigate to **Settings & Dataset** (`/settings`).
2. Under **Dataset & Experiment Controls**, click **Start Fresh Experiment (Classroom Mode)**.
3. This action preserves the 20 concepts and 5 personas, but clears all ratings and custom tests.
4. Have your 15+ classmates interact with the chatbot and submit reviews via the **Student Ratings** page.
5. Once evaluations are gathered, navigate to **Research Summary** (`/research`) to view results and click **Print / Save PDF** to generate an academic report.
6. To restore the original demo dataset at any time, simply click **Reset Demo Dataset**.

---

## 🎓 Academic Viva & Presentation Guide

When presenting this project for college evaluation or viva:
- **Demonstrate the Prompt Inspector:** Show the viva examiners that prompts are constructed through an 8-stage modular pipeline, rather than hardcoded strings.
- **Demonstrate Persona Transformation:** Show the same concept (e.g., *DBMS Normalization*) across *Examiner* (formal proof), *Friendly Senior* (decluttering Excel), and *Child-Friendly* (toy box metaphor).
- **Explain the Ablation Study:** Highlight that removing **Format** constraints causes a significant drop ($\Delta -0.85$), proving visual layout dictates comprehension.
- **Highlight Live Dynamic Metrics:** Point out that all top metric cards and charts are calculated dynamically from SQL database records, with instant CSV data exports for Python/Excel analysis.
