import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Terminal,
  Star,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Clock,
  Cpu
} from 'lucide-react';
import { getConcepts, getPersonas, sendChatMessage } from '../api';
import PromptInspector from '../components/PromptInspector';
import RatingModal from '../components/RatingModal';

export default function Chatbot() {
  const [searchParams] = useSearchParams();
  const initialPersona = searchParams.get('persona') || 'examiner';

  const [concepts, setConcepts] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState('DBMS Normalization');
  const [customConcept, setCustomConcept] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(initialPersona);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Chat message history
  const [messages, setMessages] = useState([]);

  // Modals state
  const [inspectorBreakdown, setInspectorBreakdown] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null); // { responseId, conceptName, personaName }
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [cData, pData] = await Promise.all([getConcepts(), getPersonas()]);
      setConcepts(cData);
      setPersonas(pData);
      if (cData.length > 0 && !customConcept) {
        setSelectedConcept(cData[0].name);
      }
    } catch (err) {
      console.error('Failed to load concepts/personas', err);
    }
  };

  const handleGenerate = async (personaSlugToUse = null) => {
    const conceptToUse = customConcept.trim() || selectedConcept;
    if (!conceptToUse) {
      setError('Please select or enter a concept.');
      return;
    }

    const personaSlug = personaSlugToUse || selectedPersona;
    setLoading(true);
    setError('');

    try {
      const result = await sendChatMessage({
        concept: conceptToUse,
        persona_slug: personaSlug,
        difficulty,
        length,
        include_role: true,
        include_tone: true,
        include_format: true,
        include_examples: true,
        include_instructions: true,
      });

      // Add to conversation thread
      const newMessage = {
        id: result.response_id,
        concept: conceptToUse,
        persona_slug: result.persona_slug,
        persona_name: result.persona_name,
        response_text: result.response_text,
        prompt_breakdown: result.prompt_breakdown,
        latency_ms: result.latency_ms,
        is_demo: result.is_demo,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [newMessage, ...prev]);
    } catch (err) {
      setError(err.message || 'Failed to generate explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInspectPrompt = (breakdown) => {
    setInspectorBreakdown(breakdown);
    setIsInspectorOpen(true);
  };

  const handleOpenRating = (msg) => {
    setRatingTarget({
      responseId: msg.id,
      conceptName: msg.concept,
      personaName: msg.persona_name,
    });
    setIsRatingOpen(true);
  };

  const currentConceptName = customConcept.trim() || selectedConcept;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Interactive Persona Chatbot
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Select an educational persona to generate tailored computer science explanations.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/compare?concept=${encodeURIComponent(currentConceptName)}`}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare 5 Personas Side-by-Side</span>
          </Link>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center space-x-1 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        
        {/* Concept Selector & Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>Target Concept / Topic (20 Predefined or Custom)</span>
            <span className="text-[11px] font-normal text-slate-400">Click a chip or enter any topic</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedConcept}
              onChange={(e) => {
                setSelectedConcept(e.target.value);
                setCustomConcept('');
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {concepts.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Or enter any custom topic (e.g. Dijkstra's Algorithm)..."
              value={customConcept}
              onChange={(e) => setCustomConcept(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Quick concept suggestion chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {concepts.slice(0, 7).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedConcept(c.name);
                  setCustomConcept('');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedConcept === c.name && !customConcept
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Educational Persona Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {personas.map((p) => {
              const isSelected = selectedPersona === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedPersona(p.slug)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {p.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {p.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameters: Difficulty & Length + Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Difficulty Selector */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="font-semibold">Difficulty:</span>
              <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      difficulty === d
                        ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="font-semibold">Length:</span>
              <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                {['Short', 'Medium', 'Detailed'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      length === l
                        ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 hover:scale-101"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Explanation</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

      </div>

      {/* Generated Response Cards / Chat Thread */}
      <div className="space-y-6">
        {loading && messages.length === 0 && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">Synthesizing Persona Explanation...</p>
            <p className="text-xs text-slate-500">Assembling 8-stage modular prompt and applying pedagogical style.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Message Card Header */}
            <div className="px-6 py-3.5 bg-slate-50/90 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-2xs">
                  {msg.persona_name}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {msg.concept}
                </span>
                <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{msg.latency_ms}ms</span>
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5">
                {/* Prompt Inspector Trigger */}
                <button
                  onClick={() => handleInspectPrompt(msg.prompt_breakdown)}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-indigo-600 rounded-lg shadow-2xs transition-colors"
                  title="View modular prompt structure"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Prompt Inspector</span>
                </button>

                {/* Rate this response button */}
                {msg.id && (
                  <button
                    onClick={() => handleOpenRating(msg)}
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Rate (Classmate Rubric)</span>
                  </button>
                )}

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.response_text, idx)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Response Content Body */}
            <div className="p-6 prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
              {msg.response_text}
            </div>

            {/* Quick Persona Switcher Footer on each card */}
            <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Switch persona for this exact concept:</span>
              <div className="flex flex-wrap gap-1.5">
                {personas
                  .filter((p) => p.slug !== msg.persona_slug)
                  .map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => handleGenerate(p.slug)}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
              </div>
            </div>

          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Ready to explore Prompt Engineering</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select any of the 20 preloaded BTech CSE concepts or type your own topic, pick an educational persona, and click <strong>Generate Explanation</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Prompt Inspector Modal */}
      <PromptInspector
        breakdown={inspectorBreakdown}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Student Rating Modal */}
      {ratingTarget && (
        <RatingModal
          responseId={ratingTarget.responseId}
          conceptName={ratingTarget.conceptName}
          personaName={ratingTarget.personaName}
          isOpen={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
        />
      )}

    </div>
  );
}
