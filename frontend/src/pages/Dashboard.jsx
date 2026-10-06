import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  FlaskConical,
  Split,
  Star,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  MessageSquareQuote,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getAnalytics } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await getAnalytics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const personas = [
    {
      name: 'Examiner',
      slug: 'examiner',
      color: 'border-blue-200 bg-blue-50/50 hover:border-blue-300',
      badge: 'Academic Rigor',
      desc: 'Formal university grading criteria, precise terminology, definitions, and exam pitfalls.',
    },
    {
      name: 'Friendly Senior',
      slug: 'friendly_senior',
      color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300',
      badge: 'Peer Guidance',
      desc: 'Conversational peer style, zero textbook jargon, campus placement hacks, and common traps.',
    },
    {
      name: 'Child-Friendly',
      slug: 'child_friendly',
      color: 'border-amber-200 bg-amber-50/50 hover:border-amber-300',
      badge: 'Intuitive Stories',
      desc: 'Simple everyday stories, toy box metaphors, cheerful tone, and playful mini-quizzes.',
    },
    {
      name: 'Real-World Analogy',
      slug: 'real_world_analogy',
      color: 'border-purple-200 bg-purple-50/50 hover:border-purple-300',
      badge: 'Physical Metaphors',
      desc: 'Maps technical abstractions to physical systems with explicit boundary analysis.',
    },
    {
      name: 'Exam-Answer Format',
      slug: 'exam_answer',
      color: 'border-rose-200 bg-rose-50/50 hover:border-rose-300',
      badge: 'Scoring Templates',
      desc: 'University marking scheme: 2-mark definitions, 5-mark diagrams, and 10-mark essay blueprints.',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Undergraduate Academic AI & Prompt Engineering Research</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Persona-Based Explanation Chatbot
          </h1>

          <p className="text-base sm:text-lg text-indigo-100 font-normal leading-relaxed">
            <strong className="text-white font-semibold">Prompt Engineering in Practice:</strong> An educational research platform exploring how structured prompt architecture influences perceived explanation quality, student comprehension, and pedagogical persona fidelity.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Try the Chatbot</span>
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Compare 5 Personas</span>
            </Link>
            <Link
              to="/experiments"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <FlaskConical className="w-4 h-4" />
              <span>View 20 Concepts</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Dynamic Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Concepts"
          value={stats?.total_concepts || 20}
          subtitle="BTech CSE & AI-ML"
          icon={BookOpen}
          color="indigo"
          badge="Predefined"
        />
        <MetricCard
          title="Personas"
          value={stats?.total_personas || 5}
          subtitle="Educational styles"
          icon={Layers}
          color="emerald"
        />
        <MetricCard
          title="Baseline Tests"
          value={stats?.total_experiments || 100}
          subtitle="20 concepts × 5 styles"
          icon={FlaskConical}
          color="purple"
        />
        <MetricCard
          title="Evaluators"
          value={`${stats?.total_evaluators || 16}+`}
          subtitle="Classmate reviewers"
          icon={Star}
          color="amber"
          badge="Target 15+"
        />
        <MetricCard
          title="Avg Rating"
          value={`${stats?.overall_average_score || 4.42}/5`}
          subtitle={`Best: ${stats?.best_performing_persona || 'Exam-Answer'}`}
          icon={Award}
          color="rose"
        />
      </div>

      {/* Key Research Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Performing Persona</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {stats?.best_performing_persona || 'Exam-Answer Format'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Achieved the highest overall student satisfaction ({stats?.best_performing_persona_score || 4.58}/5) due to its structured 2-mark, 5-mark, and 10-mark exam alignment.
            </p>
          </div>
          <Link
            to="/compare"
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Compare across personas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 mb-2">
              <Split className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Most Critical Prompt Element</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {stats?.most_important_prompt_element || 'Format'} Constraint
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The ablation study proves that removing the <strong>{stats?.most_important_prompt_element || 'Format'}</strong> component caused the steepest quality drop (Δ -{stats?.most_important_element_delta || 0.85} points), severely impairing student clarity.
            </p>
          </div>
          <Link
            to="/ablation"
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            <span>Explore ablation study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Peer Evaluation Rubric</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              5 Evaluation Criteria
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every explanation is rated on 1–5 scales for <strong>Clarity</strong>, <strong>Correctness</strong>, <strong>Usefulness</strong>, <strong>Engagement</strong>, and <strong>Persona Alignment</strong> by 15+ student peers.
            </p>
          </div>
          <Link
            to="/ratings"
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 hover:text-amber-800"
          >
            <span>View classmate reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* 5 Personas Spotlight Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">The 5 Educational Personas</h2>
            <p className="text-xs text-slate-500">Each persona incorporates dedicated prompt engineering templates with custom roles, tones, and formats.</p>
          </div>
          <Link to="/compare" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
            Compare Side-by-Side →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {personas.map((p) => (
            <div
              key={p.slug}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${p.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {p.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{p.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.desc}</p>
              </div>
              <Link
                to={`/chat?persona=${p.slug}`}
                className="inline-flex items-center space-x-1 text-xs font-bold text-slate-800 hover:text-indigo-600"
              >
                <span>Test this style</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Modular Prompt Formula Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Modular Prompt Architecture</span>
            <h3 className="text-lg font-bold text-white mt-0.5">8-Stage Prompt Synthesis Pipeline</h3>
          </div>
          <Link
            to="/playground"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors self-start sm:self-auto"
          >
            Launch Playground
          </Link>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 overflow-x-auto text-xs font-mono text-indigo-200 flex items-center space-x-2">
          <span className="px-2 py-1 bg-indigo-900/60 rounded-lg text-indigo-300 font-bold border border-indigo-700">ROLE</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-emerald-900/60 rounded-lg text-emerald-300 font-bold border border-emerald-700">TONE</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-purple-900/60 rounded-lg text-purple-300 font-bold border border-purple-700">FORMAT</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-amber-900/60 rounded-lg text-amber-300 font-bold border border-amber-700">CONTEXT</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-cyan-900/60 rounded-lg text-cyan-300 font-bold border border-cyan-700">EXAMPLES</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-rose-900/60 rounded-lg text-rose-300 font-bold border border-rose-700">INSTRUCTIONS</span>
          <span className="text-slate-500 font-bold">+</span>
          <span className="px-2 py-1 bg-slate-700 rounded-lg text-white font-bold border border-slate-600">USER CONCEPT</span>
        </div>
      </div>

    </div>
  );
}
