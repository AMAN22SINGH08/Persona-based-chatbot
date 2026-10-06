import time
from typing import Dict, Any, Optional
import httpx
from app import config
from app.knowledge_base import generate_academic_baseline

async def generate_explanation(
    prompt: str,
    concept: str,
    persona_slug: str,
    difficulty: str = "Intermediate",
    length: str = "Medium",
    breakdown: Optional[Dict[str, Any]] = None,
    force_demo: Optional[bool] = None
) -> Dict[str, Any]:
    start_time = time.time()
    
    use_demo = force_demo if force_demo is not None else config.is_demo_mode()
    
    if not use_demo and config.OPENAI_API_KEY:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(
                api_key=config.OPENAI_API_KEY,
                base_url=config.OPENAI_BASE_URL
            )
            response = await client.chat.completions.create(
                model=config.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert AI educational assistant specialized in persona-based computer science instruction."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            response_text = response.choices[0].message.content
            latency_ms = int((time.time() - start_time) * 1000)
            return {
                "response_text": response_text,
                "latency_ms": max(latency_ms, 120),
                "is_demo": False
            }
        except Exception as e:
            # Fall back gracefully to deterministic demo engine on API errors
            print(f"[AI Service] OpenAI API error: {e}. Falling back to Academic Engine.")
            use_demo = True

    # Deterministic Academic Engine
    base_text = generate_academic_baseline(concept, persona_slug, difficulty, length)
    
    # Apply ablation modifications if prompt components were disabled
    if breakdown:
        active = breakdown.get("active_components", [])
        
        # If Minimal Prompt (only User Concept)
        if len(active) <= 1:
            base_text = (
                f"{concept} is a topic in computer science. "
                f"It deals with computing structures, systems, and algorithms. "
                f"In general, it allows computer systems to manage information and execute tasks. "
                f"Common applications include software development, systems engineering, and data processing."
            )
        else:
            # Without Format
            if "Format" not in active:
                # Remove markdown headings and bullets, making it a continuous block
                base_text = base_text.replace("### ", "").replace("- **", "").replace("**", "")
                paragraphs = [p.strip() for p in base_text.split("\n\n") if p.strip()]
                base_text = " ".join(paragraphs)
            
            # Without Role
            if "Role" not in active:
                # Neutralize persona greeting or identity
                base_text = base_text.replace("Hey junior! Let's get clear on", "Regarding")
                base_text = base_text.replace("Hey junior! Let's break down", "Regarding")
                base_text = base_text.replace("🎒 The Story of the Super Messy Toy Box!", "Overview:")
                base_text = base_text.replace("🌟 The Adventure of", "Explanation of")
                
            # Without Tone
            if "Tone" not in active:
                base_text = base_text.replace("🚀", "").replace("💡", "").replace("🎒", "").replace("✨", "").replace("🎈", "")
                
            # Without Examples
            if "Examples" not in active:
                base_text = "\n\n".join([p for p in base_text.split("\n\n") if "Example" not in p and "Analogy" not in p])

    latency_ms = int((time.time() - start_time) * 1000) + 145 # realistic simulated latency
    return {
        "response_text": base_text,
        "latency_ms": latency_ms,
        "is_demo": True
    }
