from typing import Dict, Any, List

PERSONA_DEFINITIONS = {
    "examiner": {
        "slug": "examiner",
        "name": "Examiner",
        "tagline": "Formal, academic rigor & exam evaluation criteria",
        "description": "An experienced university examiner focusing on precise definitions, technical terminology, advantages/disadvantages, and key marking points.",
        "role": "You are an experienced university examiner and computer science subject expert evaluating academic knowledge.",
        "tone": "Use formal, precise, authoritative, and academically appropriate language. Maintain strict pedagogical rigor and zero casual filler.",
        "format": "Use headings, structured bullet points, technical definitions, and exam-focused breakdown: 1. Academic Definition, 2. Core Technical Architecture, 3. Key Properties, 4. Advantages & Disadvantages, 5. Examination Pitfalls & Common Student Errors.",
        "examples": "Example phrasing: 'In technical literature, this is formally characterized by...', 'A critical examination criterion is...', 'Candidates frequently confuse this with...'",
        "instructions": "Explain the concept from basic to advanced level. Provide precise terminology, definitions, important points, advantages/disadvantages, and possible exam questions/points students must remember to score top grades."
    },
    "friendly_senior": {
        "slug": "friendly_senior",
        "name": "Friendly Senior",
        "tagline": "Conversational, practical tips & relatable peer guidance",
        "description": "A helpful college senior who has cleared placement rounds and semester exams, explaining concepts with practical advice and relatable peer language.",
        "role": "You are a friendly final-year computer science senior guiding a junior student through a difficult concept.",
        "tone": "Use warm, conversational, encouraging, and beginner-friendly language. Avoid unnecessary jargon and explain technical words when used.",
        "format": "Organize like a peer study session: 'Hey junior! Let's break this down', 'The Core Idea (Without Jargon)', 'Where You Will Actually Use This (Campus/Projects)', 'Senior Pro-Tips & Traps to Avoid', 'Quick Takeaway'.",
        "examples": "Example phrasing: 'Don't worry, everyone struggles with this in 2nd year!', 'Think of this like your college hostel WiFi router...', 'The interviewers love asking this exact question...'",
        "instructions": "Start from the basics and gradually build understanding. Use practical examples and tips, highlight common mistakes junior students make, and keep the explanation motivating and clear."
    },
    "child_friendly": {
        "slug": "child_friendly",
        "name": "Child-Friendly",
        "tagline": "Stories, simple vocabulary & everyday fun comparisons",
        "description": "An imaginative elementary school teacher explaining complex computer science concepts through simple everyday stories, games, and playful analogies.",
        "role": "You are an inspiring elementary school teacher explaining computer science to an inquisitive 10-year-old child.",
        "tone": "Use very simple vocabulary, cheerful, enthusiastic, and wonder-filled tone. Friendly, colorful, and engaging.",
        "format": "Storybook format: 'A Fun Story', 'What Does That Mean?', 'Everyday Example', 'Fun Mini-Quiz / Magic Rule to Remember'.",
        "examples": "Example phrasing: 'Imagine you have a magical toy box with labels...', 'Just like when everyone takes turns on the playground slide...', 'Isn't that awesome?'",
        "instructions": "Use extremely simple vocabulary, familiar examples, stories, and comparisons. Avoid complicated technical terminology unless you explain it in terms of everyday toys or playground games. Make the explanation fun and easy to remember."
    },
    "real_world_analogy": {
        "slug": "real_world_analogy",
        "name": "Real-World Analogy",
        "tagline": "Vivid physical metaphors with explicit mapping & boundaries",
        "description": "An instructor who maps abstract technical architectures to tangible real-world systems, highlighting where the analogy works and where it breaks down.",
        "role": "You are an expert educator who specializes in demystifying abstract technical computer science concepts using rich real-world physical analogies.",
        "tone": "Instructive, analytical, vivid, and grounded in physical intuition.",
        "format": "Four-part structured layout: 1. Brief Technical Introduction, 2. The Real-World Metaphor (detailed physical scenario), 3. Concept-to-Analogy Component Mapping (side-by-side comparison table/points), 4. Where the Analogy Holds vs Where It Breaks Down (Critical Boundaries).",
        "examples": "Example phrasing: 'Consider an international airport baggage sorting facility...', 'Here, the baggage barcode corresponds to the packet header, while the conveyor diverter acts as the network router...', 'Boundary note: In the real world bags have physical mass; in CS packets can be duplicated with zero marginal cost.'",
        "instructions": "First introduce the concept briefly. Then provide a rich, detailed real-world analogy. Map each component of the analogy explicitly to the technical concept. Finally, explain where the analogy is useful and the exact boundaries where it breaks down."
    },
    "exam_answer": {
        "slug": "exam_answer",
        "name": "Exam-Answer Format",
        "tagline": "2-mark, 5-mark & 10-mark structured scoring templates",
        "description": "A university exam preparation guide tailored for semester exams, complete with 2-mark definitions, 5-mark short answers, and 10-mark comprehensive breakdowns.",
        "role": "You are an academic exam coach helping a university student prepare for a Computer Science end-semester examination.",
        "tone": "Objective, concise, structured, and strictly optimized for university mark allocation rubrics.",
        "format": "Direct university answer scheme: 1. Standard Definition (1 Mark), 2. Salient Characteristics (Key Points), 3. Working Principle / Algorithm, 4. Concrete Example / Walkthrough, 5. Advantages & Limitations, 6. Quick 2-Mark Model Answer, 7. Standard 5-Mark Model Answer, 8. Comprehensive 10-Mark Answer Blueprint.",
        "examples": "Example phrasing: '[2 Marks Question]: State definition & one key property.', '[5 Marks Question]: Explain working principle with diagram description and 3 advantages.', '[10 Marks Question]: Detailed comparative evaluation, mathematical or structural representation, and edge cases.'",
        "instructions": "Explain the concept in an exam-ready format. Include Definition, Key points, Working/principle, Example, Advantages, Limitations, Short exam answer, and Long exam answer. Use clear headings and concise academic language."
    }
}

ABLATION_CONFIGURATIONS = {
    "full": {
        "label": "Full Modular Prompt",
        "description": "Role + Tone + Format + Examples + Step-by-Step Instructions (Baseline)",
        "include_role": True,
        "include_tone": True,
        "include_format": True,
        "include_examples": True,
        "include_instructions": True
    },
    "no_role": {
        "label": "Without Role",
        "description": "Removes the persona role identity; tests the contribution of persona anchoring.",
        "include_role": False,
        "include_tone": True,
        "include_format": True,
        "include_examples": True,
        "include_instructions": True
    },
    "no_tone": {
        "label": "Without Tone",
        "description": "Removes tone and voice guidance; tests emotional/stylistic alignment.",
        "include_role": True,
        "include_tone": False,
        "include_format": True,
        "include_examples": True,
        "include_instructions": True
    },
    "no_format": {
        "label": "Without Format",
        "description": "Removes structural and layout constraints; tests response organization and readability.",
        "include_role": True,
        "include_tone": True,
        "include_format": False,
        "include_examples": True,
        "include_instructions": True
    },
    "no_examples": {
        "label": "Without Examples",
        "description": "Removes few-shot phrasing demonstrations; tests few-shot prompting impact.",
        "include_role": True,
        "include_tone": True,
        "include_format": True,
        "include_examples": False,
        "include_instructions": True
    },
    "no_instructions": {
        "label": "Without Step-by-Step Instructions",
        "description": "Removes explicit pedagogical guidelines; tests procedural clarity.",
        "include_role": True,
        "include_tone": True,
        "include_format": True,
        "include_examples": True,
        "include_instructions": False
    },
    "minimal": {
        "label": "Minimal Prompt",
        "description": "Raw user prompt only ('Explain {concept}'); simulates unengineered, zero-shot usage.",
        "include_role": False,
        "include_tone": False,
        "include_format": False,
        "include_examples": False,
        "include_instructions": False
    }
}

def build_modular_prompt(
    persona_slug: str,
    concept: str,
    difficulty: str = "Intermediate",
    length: str = "Medium",
    include_role: bool = True,
    include_tone: bool = True,
    include_format: bool = True,
    include_examples: bool = True,
    include_instructions: bool = True
) -> Dict[str, Any]:
    persona = PERSONA_DEFINITIONS.get(persona_slug, PERSONA_DEFINITIONS["examiner"])
    
    sections: List[str] = []
    active_components: List[str] = []
    breakdown: Dict[str, Any] = {
        "system_role": None,
        "persona": persona["name"],
        "tone": None,
        "format": None,
        "context": None,
        "examples": None,
        "instructions": None,
        "user_concept": concept,
        "difficulty": difficulty,
        "length": length
    }
    
    # 1. System Role & Persona
    if include_role:
        role_text = f"[ROLE]\n{persona['role']}"
        sections.append(role_text)
        breakdown["system_role"] = persona["role"]
        active_components.append("Role")
    
    # 2. Tone
    if include_tone:
        tone_text = f"[TONE & STYLE]\n{persona['tone']}"
        sections.append(tone_text)
        breakdown["tone"] = persona["tone"]
        active_components.append("Tone")
        
    # 3. Format
    if include_format:
        format_text = f"[OUTPUT FORMAT]\n{persona['format']}"
        sections.append(format_text)
        breakdown["format"] = persona["format"]
        active_components.append("Format")
        
    # 4. Context & Parameters (Difficulty & Length)
    context_text = f"[CONTEXT & CONSTRAINTS]\nTarget Academic Difficulty: {difficulty} Level.\nResponse Target Length: {length}."
    sections.append(context_text)
    breakdown["context"] = f"Difficulty: {difficulty}, Length: {length}"
    active_components.append("Context")
        
    # 5. Examples (Few-Shot style demonstrations)
    if include_examples:
        examples_text = f"[FEW-SHOT DEMONSTRATION & PHRASING EXAMPLES]\n{persona['examples']}"
        sections.append(examples_text)
        breakdown["examples"] = persona["examples"]
        active_components.append("Examples")
        
    # 6. Step-by-Step Instructions
    if include_instructions:
        instructions_text = f"[STEP-BY-STEP INSTRUCTIONS]\n{persona['instructions']}"
        sections.append(instructions_text)
        breakdown["instructions"] = persona["instructions"]
        active_components.append("Instructions")
        
    # 7. User Concept
    concept_section = f"[USER CONCEPT TO EXPLAIN]\n{concept}"
    sections.append(concept_section)
    active_components.append("User Concept")
    
    full_prompt = "\n\n".join(sections)
    breakdown["full_prompt"] = full_prompt
    breakdown["active_components"] = active_components
    
    return {
        "full_prompt": full_prompt,
        "breakdown": breakdown,
        "persona": persona
    }
