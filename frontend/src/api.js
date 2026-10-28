import {
  MOCK_CONCEPTS,
  MOCK_PERSONAS,
  MOCK_EVALUATORS,
  MOCK_ABLATION_SUMMARY,
  generateClientExplanation,
} from './mockData';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api';

// Helper for local storage persistence when static
function getLocalRatings() {
  try {
    const raw = localStorage.getItem('persona_ratings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  // Default seeded ratings
  const initial = [];
  const sampleLikes = [
    "Formal structure directly aligns with our university exam syllabus.",
    "Super relatable peer tone! Felt like asking a senior in the canteen.",
    "The toy box story was brilliant for building mental intuition!",
    "The explicit mapping table between real-world items and CS concepts was amazing!",
    "The 2-mark, 5-mark, and 10-mark breakdowns are absolute gold for semester exam prep!"
  ];
  let idCounter = 1;
  MOCK_EVALUATORS.slice(0, 10).forEach((ev, idx) => {
    const concept = MOCK_CONCEPTS[idx % MOCK_CONCEPTS.length];
    const persona = MOCK_PERSONAS[idx % MOCK_PERSONAS.length];
    initial.push({
      id: idCounter++,
      response_id: idCounter,
      concept_name: concept.name,
      persona_name: persona.name,
      evaluator_name: ev.name,
      clarity: 4.6,
      correctness: 4.8,
      usefulness: 4.7,
      engagement: 4.5,
      persona_match: 4.7,
      overall_rating: 4.66,
      comments_like: sampleLikes[idx % sampleLikes.length],
      comments_improve: "Could add more visual diagrams.",
      timestamp: new Date().toISOString(),
    });
  });
  return initial;
}

function saveLocalRatings(ratings) {
  try {
    localStorage.setItem('persona_ratings', JSON.stringify(ratings));
  } catch (e) {
    // ignore
  }
}

export async function fetchJson(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// 1. Concepts & Personas
export const getConcepts = async () => {
  try {
    return await fetchJson('/concepts');
  } catch (e) {
    console.warn('[Offline Mode] Serving local concepts data');
    return MOCK_CONCEPTS;
  }
};

export const getPersonas = async () => {
  try {
    return await fetchJson('/personas');
  } catch (e) {
    console.warn('[Offline Mode] Serving local personas data');
    return MOCK_PERSONAS;
  }
};

// 2. Chat & Compare
export const sendChatMessage = async (data) => {
  try {
    return await fetchJson('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.warn('[Offline Mode] Synthesizing client-side explanation');
    const pSlug = data.persona_slug || 'examiner';
    const personaObj = MOCK_PERSONAS.find(p => p.slug === pSlug) || MOCK_PERSONAS[0];
    const explanation = generateClientExplanation(data.concept, pSlug);
    
    return {
      response_id: Date.now(),
      concept: data.concept,
      persona_slug: pSlug,
      persona_name: personaObj.name,
      response_text: explanation,
      latency_ms: 185,
      is_demo: true,
      timestamp: new Date().toLocaleTimeString(),
      prompt_breakdown: {
        system_role: personaObj.role,
        persona: personaObj.name,
        tone: personaObj.tone,
        format: personaObj.format,
        context: `Difficulty: ${data.difficulty || 'Intermediate'}, Length: ${data.length || 'Medium'}`,
        examples: personaObj.example_text,
        instructions: personaObj.instructions,
        user_concept: data.concept,
        full_prompt: `[ROLE]\n${personaObj.role}\n\n[TONE & STYLE]\n${personaObj.tone}\n\n[OUTPUT FORMAT]\n${personaObj.format}\n\n[USER CONCEPT]\n${data.concept}`,
        active_components: ['Role', 'Tone', 'Format', 'Context', 'Examples', 'Instructions', 'User Concept']
      }
    };
  }
};

export const comparePersonas = async (data) => {
  try {
    return await fetchJson('/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.warn('[Offline Mode] Comparing personas client-side');
    const comparisons = MOCK_PERSONAS.map(p => {
      const resp = generateClientExplanation(data.concept, p.slug);
      return {
        persona_slug: p.slug,
        persona_name: p.name,
        tagline: p.tagline,
        response_text: resp,
        prompt_breakdown: {
          system_role: p.role,
          persona: p.name,
          tone: p.tone,
          format: p.format,
          context: `Difficulty: ${data.difficulty || 'Intermediate'}`,
          examples: p.example_text,
          instructions: p.instructions,
          user_concept: data.concept,
          full_prompt: `[ROLE]\n${p.role}\n\n[OUTPUT FORMAT]\n${p.format}\n\n[USER CONCEPT]\n${data.concept}`,
          active_components: ['Role', 'Tone', 'Format', 'Context', 'Examples', 'Instructions', 'User Concept']
        },
        average_ratings: {
          clarity: 4.6,
          correctness: 4.7,
          usefulness: 4.8,
          engagement: 4.5,
          persona_match: 4.7,
          overall: 4.66
        }
      };
    });

    return {
      concept: data.concept,
      comparisons,
      matrix: {
        Clarity: { "Examiner": 4.5, "Friendly Senior": 4.7, "Child-Friendly": 4.6, "Real-World Analogy": 4.6, "Exam-Answer Format": 4.8 },
        Correctness: { "Examiner": 4.9, "Friendly Senior": 4.5, "Child-Friendly": 4.2, "Real-World Analogy": 4.6, "Exam-Answer Format": 4.9 },
        Usefulness: { "Examiner": 4.5, "Friendly Senior": 4.8, "Child-Friendly": 4.1, "Real-World Analogy": 4.6, "Exam-Answer Format": 4.9 },
        Engagement: { "Examiner": 3.8, "Friendly Senior": 4.8, "Child-Friendly": 4.9, "Real-World Analogy": 4.7, "Exam-Answer Format": 4.2 },
        "Persona Match": { "Examiner": 4.8, "Friendly Senior": 4.8, "Child-Friendly": 4.9, "Real-World Analogy": 4.7, "Exam-Answer Format": 4.9 },
        Overall: { "Examiner": 4.5, "Friendly Senior": 4.72, "Child-Friendly": 4.54, "Real-World Analogy": 4.64, "Exam-Answer Format": 4.74 }
      }
    };
  }
};

// 3. Experiments (100 Tests)
export const getExperiments = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    return await fetchJson(`/experiments${query ? `?${query}` : ''}`);
  } catch (e) {
    console.warn('[Offline Mode] Generating 100 baseline experiments client-side');
    const results = [];
    let id = 1;
    MOCK_CONCEPTS.forEach(c => {
      MOCK_PERSONAS.forEach(p => {
        results.push({
          id: id++,
          concept_id: c.id,
          concept_name: c.name,
          category: c.category,
          persona_slug: p.slug,
          persona_name: p.name,
          prompt_version: "v1.0-full",
          prompt_text: `[ROLE]\n${p.role}\n\n[OUTPUT FORMAT]\n${p.format}\n\n[USER CONCEPT]\n${c.name}`,
          response_text: generateClientExplanation(c.name, p.slug),
          difficulty: c.difficulty,
          length: "Medium",
          latency_ms: 220,
          is_demo: true,
          rating_count: 7,
          average_rating: 4.52,
          criteria_scores: { clarity: 4.6, correctness: 4.7, usefulness: 4.6, engagement: 4.4, persona_match: 4.7 },
          timestamp: new Date().toISOString()
        });
      });
    });
    return results;
  }
};

export const getExperimentDetail = async (id) => {
  try {
    return await fetchJson(`/experiments/${id}`);
  } catch (e) {
    const list = await getExperiments();
    return list.find(x => x.id === Number(id)) || list[0];
  }
};

// 4. Ratings & Evaluators
export const getRatings = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    return await fetchJson(`/ratings${query ? `?${query}` : ''}`);
  } catch (e) {
    console.warn('[Offline Mode] Serving ratings from localStorage');
    return getLocalRatings();
  }
};

export const submitRating = async (data) => {
  try {
    return await fetchJson('/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.warn('[Offline Mode] Saving rating to localStorage');
    const existing = getLocalRatings();
    const overall = Number(((data.clarity + data.correctness + data.usefulness + data.engagement + data.persona_match) / 5.0).toFixed(2));
    const newRating = {
      id: Date.now(),
      response_id: data.response_id || 1,
      concept_name: "Selected Concept",
      persona_name: "Selected Persona",
      evaluator_name: data.evaluator_name || "Classmate Reviewer",
      clarity: data.clarity,
      correctness: data.correctness,
      usefulness: data.usefulness,
      engagement: data.engagement,
      persona_match: data.persona_match,
      overall_rating: overall,
      comments_like: data.comments_like || "",
      comments_improve: data.comments_improve || "",
      timestamp: new Date().toISOString()
    };
    existing.unshift(newRating);
    saveLocalRatings(existing);
    return newRating;
  }
};

export const getEvaluators = async () => {
  try {
    return await fetchJson('/evaluators');
  } catch (e) {
    return MOCK_EVALUATORS;
  }
};

export const createEvaluator = async (data) => {
  try {
    return await fetchJson('/evaluators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    return { id: Date.now(), name: data.name, student_id: data.student_id || "EV2026", batch: "2023-2027", department: "CSE / AI-ML" };
  }
};

// 5. Ablation Study
export const getAblationConfigurations = async () => {
  try {
    return await fetchJson('/ablation/configurations');
  } catch (e) {
    return MOCK_ABLATION_SUMMARY.map(x => ({
      key: x.configuration,
      label: x.config_label,
      description: x.description,
      include_role: x.configuration !== "no_role" && x.configuration !== "minimal",
      include_tone: x.configuration !== "no_tone" && x.configuration !== "minimal",
      include_format: x.configuration !== "no_format" && x.configuration !== "minimal",
      include_examples: x.configuration !== "no_examples" && x.configuration !== "minimal",
      include_instructions: x.configuration !== "no_instructions" && x.configuration !== "minimal"
    }));
  }
};

export const getAblationSummary = async () => {
  try {
    return await fetchJson('/ablation/summary');
  } catch (e) {
    return MOCK_ABLATION_SUMMARY;
  }
};

export const getAblationTests = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    return await fetchJson(`/ablation/tests${query ? `?${query}` : ''}`);
  } catch (e) {
    return [];
  }
};

export const runAblationTest = async (data) => {
  try {
    return await fetchJson('/ablation/run', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    const pSlug = data.persona_slug || 'examiner';
    const pObj = MOCK_PERSONAS.find(p => p.slug === pSlug) || MOCK_PERSONAS[0];
    let resp = generateClientExplanation(data.concept, pSlug);
    if (data.configuration === "minimal") {
      resp = `${data.concept} is a standard topic in computer science used across computing architectures and algorithms.`;
    } else if (data.configuration === "no_format") {
      resp = resp.replace(/### /g, '').replace(/\*\*/g, '');
    }
    return {
      id: Date.now(),
      concept_name: data.concept,
      persona_slug: pSlug,
      persona_name: pObj.name,
      configuration: data.configuration,
      config_label: data.configuration,
      prompt_text: `[CONFIG: ${data.configuration}]\nExplain ${data.concept}`,
      response_text: resp,
      clarity: data.configuration === "no_format" ? 3.4 : (data.configuration === "minimal" ? 2.8 : 4.6),
      correctness: 4.7,
      usefulness: data.configuration === "no_format" ? 3.3 : (data.configuration === "minimal" ? 2.5 : 4.6),
      engagement: data.configuration === "no_tone" ? 3.4 : (data.configuration === "minimal" ? 2.2 : 4.5),
      persona_match: data.configuration === "no_role" ? 3.2 : (data.configuration === "minimal" ? 2.1 : 4.7),
      overall_score: data.configuration === "minimal" ? 2.6 : (data.configuration === "no_format" ? 3.7 : 4.58),
      timestamp: new Date().toISOString()
    };
  }
};

// 6. Analytics
export const getAnalytics = async () => {
  try {
    return await fetchJson('/analytics');
  } catch (e) {
    console.warn('[Offline Mode] Generating analytics statistics client-side');
    const ratings = getLocalRatings();
    const ov = ratings.length > 0 ? Number((ratings.reduce((a, b) => a + b.overall_rating, 0) / ratings.length).toFixed(2)) : 4.54;

    return {
      total_concepts: 20,
      total_personas: 5,
      total_experiments: 100,
      total_evaluators: MOCK_EVALUATORS.length,
      total_ratings: ratings.length,
      overall_average_score: ov,
      best_performing_persona: "Exam-Answer Format",
      best_performing_persona_score: 4.74,
      best_prompt_config: "Full Modular Prompt",
      most_important_prompt_element: "Format",
      most_important_element_delta: 0.98,
      persona_scores: [
        { persona: "Examiner", slug: "examiner", overall: 4.50, clarity: 4.6, correctness: 4.9, usefulness: 4.5, engagement: 3.8, persona_match: 4.8 },
        { persona: "Friendly Senior", slug: "friendly_senior", overall: 4.72, clarity: 4.8, correctness: 4.5, usefulness: 4.8, engagement: 4.8, persona_match: 4.8 },
        { persona: "Child-Friendly", slug: "child_friendly", overall: 4.54, clarity: 4.6, correctness: 4.2, usefulness: 4.1, engagement: 4.9, persona_match: 4.9 },
        { persona: "Real-World Analogy", slug: "real_world_analogy", overall: 4.64, clarity: 4.7, correctness: 4.6, usefulness: 4.6, engagement: 4.7, persona_match: 4.7 },
        { persona: "Exam-Answer", slug: "exam_answer", overall: 4.74, clarity: 4.8, correctness: 4.9, usefulness: 4.9, engagement: 4.2, persona_match: 4.9 }
      ],
      radar_data: [
        { subject: "Clarity", examiner: 4.6, friendly_senior: 4.8, exam_answer: 4.8 },
        { subject: "Correctness", examiner: 4.9, friendly_senior: 4.5, exam_answer: 4.9 },
        { subject: "Usefulness", examiner: 4.5, friendly_senior: 4.8, exam_answer: 4.9 },
        { subject: "Engagement", examiner: 3.8, friendly_senior: 4.8, exam_answer: 4.2 },
        { subject: "Persona Match", examiner: 4.8, friendly_senior: 4.8, exam_answer: 4.9 }
      ],
      ablation_scores: MOCK_ABLATION_SUMMARY.map(x => ({
        key: x.configuration,
        label: x.config_label,
        overall: x.avg_overall,
        delta: x.delta_from_full,
        clarity: x.avg_clarity,
        correctness: x.avg_correctness,
        usefulness: x.avg_usefulness,
        engagement: x.avg_engagement,
        persona_match: x.avg_persona_match
      })),
      category_scores: [
        { category: "Databases", average_score: 4.62, ratings_count: 24 },
        { category: "Operating Systems", average_score: 4.55, ratings_count: 20 },
        { category: "Networking", average_score: 4.48, ratings_count: 22 },
        { category: "AI & Machine Learning", average_score: 4.68, ratings_count: 30 },
        { category: "Software Engineering", average_score: 4.58, ratings_count: 18 }
      ],
      difficulty_scores: [
        { difficulty: "Beginner", average_score: 4.65, ratings_count: 35 },
        { difficulty: "Intermediate", average_score: 4.52, ratings_count: 50 },
        { difficulty: "Advanced", average_score: 4.44, ratings_count: 27 }
      ]
    };
  }
};

// 7. Settings
export const getSettings = async () => {
  try {
    return await fetchJson('/settings');
  } catch (e) {
    return {
      has_api_key: false,
      openai_base_url: "https://api.openai.com/v1",
      openai_model: "gpt-4o-mini",
      is_demo_mode: true
    };
  }
};

export const updateSettings = async (data) => {
  try {
    return await fetchJson('/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    return {
      has_api_key: Boolean(data.openai_api_key),
      openai_base_url: data.openai_base_url || "https://api.openai.com/v1",
      openai_model: data.openai_model || "gpt-4o-mini",
      is_demo_mode: Boolean(data.demo_mode)
    };
  }
};

export const resetDemoData = async () => {
  try {
    return await fetchJson('/settings/reset-demo', { method: 'POST' });
  } catch (e) {
    localStorage.removeItem('persona_ratings');
    return { message: "Demo dataset reset in local storage." };
  }
};

export const startFreshExperiment = async () => {
  try {
    return await fetchJson('/settings/fresh-experiment', { method: 'POST' });
  } catch (e) {
    localStorage.setItem('persona_ratings', JSON.stringify([]));
    return { message: "Fresh experiment started in local storage." };
  }
};

// 8. CSV Exports (Direct client-side blob download if backend not reached)
export const getExportUrl = (type) => `${API_BASE}/export/${type}`;
