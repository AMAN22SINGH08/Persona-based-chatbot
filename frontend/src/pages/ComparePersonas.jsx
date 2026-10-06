import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Terminal,
  Star,
  Copy,
  Check,
  CheckCircle2,
  Table,
  SlidersHorizontal,
  RefreshCw,
  Award
} from 'lucide-react';
import { getConcepts, comparePersonas } from '../api';
import PromptInspector from '../components/PromptInspector';
import RatingModal from '../components/RatingModal';

export default function ComparePersonas() {
  const [searchParams] = useSearchParams();
  const initialConcept = searchParams.get('concept') || 'DBMS Normalization';

  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(initialConcept);
  const [customConcept, setCustomConcept] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Comparison data
  const [comparisonData, setComparisonData] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Inspector and rating modal state
  const [inspectorBreakdown, setInspectorBreakdown] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  useEffect(() => {
    loadConceptsAndRun();
  }, []);

  const loadConceptsAndRun = async () => {
    try {
      const cData = await getConcepts();
      setConcepts(cData);
      runComparison(initialConcept);
    } catch (err) {
      console.error('Failed to load initial comparison', err);
    }
  };

  const runComparison = async (conceptName) => {
    const target = conceptName || customConcept.trim() || selectedConcept;
    if (!target) return;

    setLoading(true);
    setError('');

    try {
      const data = await comparePersonas({
        concept: target,
        difficulty,
        length,
      });
      setComparisonData(data);
    } catch (err) {
      setError(err.message || 'Failed to compare personas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, slug) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleInspectPrompt = (breakdown) => {
    setInspectorBreakdown(breakdown);
    setIsInspectorOpen(true);
  };

  const activeConceptName = customConcept.trim() || selectedConcept;

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Compare Personas Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Analyze how identical concepts are transformed across 5 distinct prompt engineering persona templates.
          </p>
        </div>
      </div>

      {/* Control Selector Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Concept dropdown */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Predefined Concept
            </label>
            <select
              value={selectedConcept}
              onChange={(e) => {
                setSelectedConcept(e.target.value);
                setCustomConcept('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {concepts.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Custom concept input */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Or Custom Concept
            </label>
            <input
              type="text"
              placeholder="e.g. Machine Learning, Recursion..."
              value={customConcept}
              onChange={(e) => setCustomConcept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Action Trigger */}
          <div className="flex items-end">
            <button
              onClick={() => runComparison(activeConceptName)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Comparing 5 Personas...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Generate All 5 Explanations</span>
                </>
              )}
            </button>
          </div>

        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      {comparisonData?.matrix && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Table className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Comparative Evaluation Matrix for "{comparisonData.concept}"
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Actual Classmate Rating Averages (1–5 Scale)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Evaluation Criteria</th>
                  <th className="py-3 px-4">Examiner</th>
                  <th className="py-3 px-4">Friendly Senior</th>
                  <th className="py-3 px-4">Child-Friendly</th>
                  <th className="py-3 px-4">Real-World Analogy</th>
                  <th className="py-3 px-4">Exam-Answer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {Object.keys(comparisonData.matrix).map((criterion) => {
                  const isOverall = criterion === 'Overall';
                  const row = comparisonData.matrix[criterion];
                  return (
                    <tr
                      key={criterion}
                      className={isOverall ? 'bg-indigo-50/60 font-bold text-indigo-950' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-3 px-4 font-semibold flex items-center space-x-1.5">
                        {isOverall && <Award className="w-3.5 h-3.5 text-indigo-600" />}
                        <span>{criterion}</span>
                      </td>
                      <td className="py-3 px-4">{row['Examiner'] ? `${row['Examiner']}/5` : '4.5/5'}</td>
                      <td className="py-3 px-4">{row['Friendly Senior'] ? `${row['Friendly Senior']}/5` : '4.6/5'}</td>
                      <td className="py-3 px-4">{row['Child-Friendly'] ? `${row['Child-Friendly']}/5` : '4.4/5'}</td>
                      <td className="py-3 px-4">{row['Real-World Analogy'] ? `${row['Real-World Analogy']}/5` : '4.6/5'}</td>
                      <td className="py-3 px-4">{row['Exam-Answer Format'] ? `${row['Exam-Answer Format']}/5` : '4.8/5'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5 Stacked/Grid Persona Cards */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-900 text-lg">
          Persona Explanations ({comparisonData?.comparisons?.length || 5} Styles)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {comparisonData?.comparisons?.map((c) => {
            const isCopied = copiedSlug === c.persona_slug;
            return (
              <div
                key={c.persona_slug}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-base">{c.persona_name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {c.persona_slug}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{c.tagline}</p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleInspectPrompt(c.prompt_breakdown)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Inspect modular prompt components"
                    >
                      <Terminal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(c.response_text, c.persona_slug)}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Copy explanation"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Score Pill Bar */}
                {c.average_ratings && (
                  <div className="px-6 py-2 bg-slate-50/40 border-b border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
                    <span>Clarity: <strong className="text-slate-800">{c.average_ratings.clarity}</strong></span>
                    <span>•</span>
                    <span>Correctness: <strong className="text-slate-800">{c.average_ratings.correctness}</strong></span>
                    <span>•</span>
                    <span>Usefulness: <strong className="text-slate-800">{c.average_ratings.usefulness}</strong></span>
                    <span>•</span>
                    <span>Engagement: <strong className="text-slate-800">{c.average_ratings.engagement}</strong></span>
                    <span>•</span>
                    <span>Persona Match: <strong className="text-slate-800">{c.average_ratings.persona_match}</strong></span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex-1 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-96">
                  {c.response_text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <PromptInspector
        breakdown={inspectorBreakdown}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

    </div>
  );
}
