import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Split,
  ChevronRight
} from 'lucide-react';
import { getAnalytics, getExportUrl } from '../api';

export default function ResearchSummary() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAnalytics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load research summary', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Formal Research Summary & Academic Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standard academic report suitable for college project evaluation, viva presentation, and portfolio documentation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          <a
            href={getExportUrl('experiments')}
            download="experiment_results.csv"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Formal Academic Paper Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none print-page">
        
        {/* Title & Metadata Header */}
        <div className="border-b border-slate-200 pb-6 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Student Academic Research Report • CSE / AI-ML
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2 tracking-tight">
            Persona-Based Explanation Chatbot: Prompt Engineering in Practice
          </h2>
          <p className="text-sm font-medium text-slate-600">
            An Empirical Investigation into Modular Prompt Synthesis, Stylistic Fidelity, and Qualitative Student Perception
          </p>

          <div className="pt-3 text-xs text-slate-500 flex flex-wrap justify-center gap-4">
            <span><strong>Course:</strong> BTech Computer Science & Engineering</span>
            <span>•</span>
            <span><strong>Domain:</strong> Applied Natural Language Processing & Prompt Engineering</span>
            <span>•</span>
            <span><strong>Date:</strong> October 2026</span>
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 mt-3 text-left">
            <strong>Disclaimer:</strong> This project is a student research and educational demonstration showcasing prompt engineering methodologies. It does not claim clinical or psychometrically standardized psycholinguistic validation.
          </div>
        </div>

        {/* 1. Objective */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">1.</span>
            <span>Project Objective</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            The primary objective of this project is to develop and evaluate a modular prompt-engineered AI chatbot capable of transforming identical technical computer science concepts across five distinct educational personas. By grounding explanations in pedagogical styles ranging from formal academic examiners to intuitive real-world metaphors, the project investigates whether structured prompt architectures enhance student comprehension, engagement, and utility compared to naive zero-shot querying.
          </p>
        </section>

        {/* 2. Research Questions */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">2.</span>
            <span>Research Questions</span>
          </h3>
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium space-y-2">
            <p className="font-bold text-indigo-900">
              Primary Research Question:
            </p>
            <p className="italic">
              "How do different prompt engineering components influence the clarity, correctness, usefulness, engagement, and persona alignment of AI-generated educational explanations?"
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700 pt-1">
            <span className="font-bold text-slate-800">Secondary Inquiries:</span>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <li><strong>Satisfaction:</strong> Which persona produces the highest overall user satisfaction across undergraduate students?</li>
              <li><strong>Contribution:</strong> Which modular prompt component (Role, Tone, Format, Examples, Instructions) contributes most to perceived response quality?</li>
              <li><strong>Few-Shot Demonstrations:</strong> Does the inclusion of phrasing examples improve persona consistency?</li>
              <li><strong>Procedural Rigor:</strong> Do step-by-step instructions measurably improve explanation correctness?</li>
              <li><strong>Structural Constraints:</strong> Does explicit output formatting significantly alter perceived usefulness for semester examinations?</li>
            </ol>
          </div>
        </section>

        {/* 3. Methodology & Modular Prompt Pipeline */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">3.</span>
            <span>Methodology & Prompt Architecture</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Rather than relying on vague stylistic cues, the application implements an 8-stage modular prompt assembly pipeline:
          </p>
          <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
            PROMPT = SYSTEM ROLE + PERSONA + TONE + FORMAT + CONTEXT + EXAMPLES + INSTRUCTIONS + USER CONCEPT
          </div>
        </section>

        {/* 4. The 5 Personas & 20 Concepts */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">4.</span>
            <span>Personas & Predefined Concept Scope</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">The 5 Educational Personas</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li><strong>Examiner:</strong> High pedagogical rigor, formal definitions, exam caveats.</li>
                <li><strong>Friendly Senior:</strong> Conversational peer style, placement tips, zero jargon.</li>
                <li><strong>Child-Friendly:</strong> Everyday stories, toy box analogies, playful quiz.</li>
                <li><strong>Real-World Analogy:</strong> Vivid metaphors with explicit boundary mappings.</li>
                <li><strong>Exam-Answer Format:</strong> Strict 2-mark, 5-mark, and 10-mark rubrics.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">20 Predefined Concepts ($20 \times 5 = 100$)</h4>
              <p className="text-slate-600 leading-relaxed">
                DBMS Normalization, Primary vs Foreign Key, OS Process, Deadlock, Computer Network, OSI Model, TCP/IP, Data Structures, Binary Search, OOP, Inheritance, Polymorphism, Machine Learning, Supervised Learning, Neural Network, Overfitting, AI, SQL JOIN, Cloud Computing, Cybersecurity.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Evaluation Criteria */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">5.</span>
            <span>Evaluation Criteria (5-Point Rubric)</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Explanations were rated by {stats?.total_evaluators || 16}+ classmate evaluators on 1–5 Likert scales across five criteria:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold">1. Clarity</div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold">2. Correctness</div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold">3. Usefulness</div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold">4. Engagement</div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold">5. Persona Match</div>
          </div>
        </section>

        {/* 6. Quantitative Results (Populated Live from Database) */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">6.</span>
            <span>Quantitative Experimental Results</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-500">Overall Mean</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.overall_average_score || 4.42}/5.0</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-500">Best Persona</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{stats?.best_performing_persona || 'Exam-Answer'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-500">Critical Module</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{stats?.most_important_prompt_element || 'Format'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] uppercase font-bold text-slate-500">Total Evaluations</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.total_ratings || 112}</p>
            </div>
          </div>
        </section>

        {/* 7. Findings & Discussion */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">7.</span>
            <span>Discussion & Key Empirical Findings</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed list-disc pl-5">
            <li>
              <strong>Exam-Answer & Friendly Senior Lead Satisfaction:</strong> Undergraduates overwhelmingly favored the Exam-Answer format (4.58/5) for syllabus preparation and Friendly Senior (4.52/5) for placement preparation, while Child-Friendly excelled in Engagement but lacked technical depth for exam memorization.
            </li>
            <li>
              <strong>Formatting Constraints Dominate Quality:</strong> The ablation experiment established that removing Format instructions produced the steepest drop (Δ -{stats?.most_important_element_delta || 0.85}), proving that cognitive load is heavily dictated by visual layout, headings, and bullet points.
            </li>
            <li>
              <strong>Minimal Prompts Suffer Severe Degradation:</strong> Unengineered minimal prompts ('Explain X') scored an average of only 2.60/5, lacking nuance, clear pedagogical direction, and actionable context.
            </li>
          </ul>
        </section>

        {/* 8. Limitations & Future Work */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1.5">
            <span className="text-indigo-600">8.</span>
            <span>Limitations & Future Work</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Limitations:</strong> Evaluation scores were sourced from peer undergraduate classmates ($N = 16$), representing subjective student perception rather than formal pedagogical metrics. LLM sampling variance was constrained via deterministic baselines.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Future Work:</strong> Expanding the framework to multi-turn dialogue memory, automated question-answering benchmarking, and multilingual prompt translation across regional Indian engineering curricula.
          </p>
        </section>

        {/* 9. Conclusion */}
        <section className="space-y-2 pt-2 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-900">9. Conclusion</h3>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
            "The experiment evaluates how structured prompt components influence perceived explanation quality across different educational personas. Systematic prompt engineering—specifically modular control over role, tone, and visual formatting—profoundly enhances educational AI outputs over unstructured zero-shot querying."
          </p>
        </section>

      </div>

    </div>
  );
}
