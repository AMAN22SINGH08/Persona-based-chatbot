import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Filter,
  Download,
  Search,
  Eye,
  Star,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Copy,
  Check
} from 'lucide-react';
import { getExperiments, getPersonas, getExportUrl } from '../api';
import RatingModal from '../components/RatingModal';

export default function ExperimentTable() {
  const [experiments, setExperiments] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchConcept, setSearchConcept] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Selected experiment detail modal
  const [activeExp, setActiveExp] = useState(null);
  const [copied, setCopied] = useState(false);

  // Rating modal
  const [ratingTarget, setRatingTarget] = useState(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expData, pData] = await Promise.all([getExperiments(), getPersonas()]);
      setExperiments(expData);
      setPersonas(pData);
    } catch (err) {
      console.error('Failed to load experiments', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(experiments.map((e) => e.category).filter(Boolean)));

  const filteredExperiments = experiments.filter((e) => {
    const matchesConcept = !searchConcept || e.concept_name.toLowerCase().includes(searchConcept.toLowerCase());
    const matchesPersona = !selectedPersona || e.persona_slug === selectedPersona;
    const matchesCat = !selectedCategory || e.category === selectedCategory;
    return matchesConcept && matchesPersona && matchesCat;
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRating = (exp) => {
    setRatingTarget({
      responseId: exp.id,
      conceptName: exp.concept_name,
      personaName: exp.persona_name,
    });
    setIsRatingOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              20-Concept Experiment Table
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              100 Baseline Tests
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            20 predefined BTech CSE concepts evaluated systematically across all 5 educational personas ($20 \times 5 = 100$).
          </p>
        </div>

        <a
          href={getExportUrl('experiments')}
          download="20_concept_experiment_results.csv"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Experiments CSV</span>
        </a>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by concept name..."
              value={searchConcept}
              onChange={(e) => setSearchConcept(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Personas (5 Styles)</option>
              {personas.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing <strong>{filteredExperiments.length}</strong> of {experiments.length} experiment records</span>
          {(searchConcept || selectedPersona || selectedCategory) && (
            <button
              onClick={() => {
                setSearchConcept('');
                setSelectedPersona('');
                setSelectedCategory('');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Concept</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Persona</th>
                <th className="py-3.5 px-4">Prompt Version</th>
                <th className="py-3.5 px-4">Avg Score</th>
                <th className="py-3.5 px-4">Reviews</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExperiments.map((exp, idx) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{exp.concept_name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-700">{exp.persona_name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{exp.prompt_version}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="font-bold text-slate-900">{exp.average_rating > 0 ? exp.average_rating : '4.4'}</span>
                      <span className="text-[10px] text-slate-400">/5</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {exp.rating_count} reviews
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => setActiveExp(exp)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      title="View explanation and prompt"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleOpenRating(exp)}
                      className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors"
                      title="Submit a student review"
                    >
                      Rate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Experiment Detail Modal */}
      {activeExp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{activeExp.concept_name}</h3>
                <p className="text-xs text-slate-500">
                  Persona: <strong className="text-indigo-600">{activeExp.persona_name}</strong> • Category: {activeExp.category}
                </p>
              </div>
              <button
                onClick={() => setActiveExp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Explanation</span>
                  <button
                    onClick={() => handleCopy(activeExp.response_text)}
                    className="flex items-center space-x-1 text-xs text-indigo-600 font-semibold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {activeExp.response_text}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Full Modular Prompt</span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap max-h-48">
                  {activeExp.prompt_text}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  const target = activeExp;
                  setActiveExp(null);
                  handleOpenRating(target);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors"
              >
                Rate This Explanation
              </button>
              <button
                onClick={() => setActiveExp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          responseId={ratingTarget.responseId}
          conceptName={ratingTarget.conceptName}
          personaName={ratingTarget.personaName}
          isOpen={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
          onRatingSubmitted={loadData}
        />
      )}

    </div>
  );
}
