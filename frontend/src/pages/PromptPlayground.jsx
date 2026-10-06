import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';
import { getConcepts, getPersonas, sendChatMessage } from '../api';

export default function PromptPlayground() {
  const [concepts, setConcepts] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState('Operating System Process');
  const [customConcept, setCustomConcept] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('friendly_senior');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [length, setLength] = useState('Medium');

  // Component Toggles
  const [includeRole, setIncludeRole] = useState(true);
  const [includeTone, setIncludeTone] = useState(true);
  const [includeFormat, setIncludeFormat] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeInstructions, setIncludeInstructions] = useState(true);

  // Results
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [latency, setLatency] = useState(null);
  const [activeComponents, setActiveComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cData, pData] = await Promise.all([getConcepts(), getPersonas()]);
      setConcepts(cData);
      setPersonas(pData);
      updatePreviewPrompt(cData[2]?.name || 'Operating System Process', 'friendly_senior', true, true, true, true, true);
    } catch (err) {
      console.error('Failed to load playground initial data', err);
    }
  };

  const updatePreviewPrompt = (concept, pSlug, r, t, f, ex, ins) => {
    const p = personas.find((x) => x.slug === pSlug) || {
      role: 'You are an educator...',
      tone: 'Conversational...',
      format: 'Headings...',
      examples: 'Example phrasing...',
      instructions: 'Explain step by step...',
    };

    const parts = [];
    const active = [];

    if (r) {
      parts.push(`[ROLE]\n${p.role}`);
      active.push('Role');
    }
    if (t) {
      parts.push(`[TONE & STYLE]\n${p.tone}`);
      active.push('Tone');
    }
    if (f) {
      parts.push(`[OUTPUT FORMAT]\n${p.format}`);
      active.push('Format');
    }
    parts.push(`[CONTEXT & CONSTRAINTS]\nTarget Academic Difficulty: ${difficulty} Level.\nResponse Target Length: ${length}.`);
    active.push('Context');

    if (ex) {
      parts.push(`[FEW-SHOT EXAMPLES]\n${p.examples || p.example_text}`);
      active.push('Examples');
    }
    if (ins) {
      parts.push(`[STEP-BY-STEP INSTRUCTIONS]\n${p.instructions}`);
      active.push('Instructions');
    }
    parts.push(`[USER CONCEPT TO EXPLAIN]\n${concept}`);
    active.push('User Concept');

    setGeneratedPrompt(parts.join('\n\n'));
    setActiveComponents(active);
  };

  // Re-compute preview whenever toggles or inputs change
  useEffect(() => {
    const concept = customConcept.trim() || selectedConcept;
    if (personas.length > 0) {
      updatePreviewPrompt(concept, selectedPersona, includeRole, includeTone, includeFormat, includeExamples, includeInstructions);
    }
  }, [selectedConcept, customConcept, selectedPersona, difficulty, length, includeRole, includeTone, includeFormat, includeExamples, includeInstructions, personas]);

  const handleRunPlayground = async () => {
    const concept = customConcept.trim() || selectedConcept;
    if (!concept) return;

    setLoading(true);
    setError('');

    try {
      const res = await sendChatMessage({
        concept,
        persona_slug: selectedPersona,
        difficulty,
        length,
        include_role: includeRole,
        include_tone: includeTone,
        include_format: includeFormat,
        include_examples: includeExamples,
        include_instructions: includeInstructions,
      });

      setAiResponse(res.response_text);
      setLatency(res.latency_ms);
      setGeneratedPrompt(res.prompt_breakdown?.full_prompt || generatedPrompt);
    } catch (err) {
      setError(err.message || 'Failed to synthesize response.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const toggles = [
    { label: 'Role & Persona Identity', state: includeRole, set: setIncludeRole, desc: 'Anchors the pedagogical perspective and authority.' },
    { label: 'Tone & Stylistic Voice', state: includeTone, set: setIncludeTone, desc: 'Controls vocabulary difficulty, empathy, and formality.' },
    { label: 'Output Format Constraints', state: includeFormat, set: setIncludeFormat, desc: 'Structures paragraphs, bullet points, and headers.' },
    { label: 'Few-Shot Phrasing Examples', state: includeExamples, set: setIncludeExamples, desc: 'Demonstrates expected idioms and answer length.' },
    { label: 'Step-by-Step Instructions', state: includeInstructions, set: setIncludeInstructions, desc: 'Guides progression from basic definition to edge cases.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Interactive Prompt Playground
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Toggle individual prompt engineering components on/off and observe in real time how prompt architecture impacts model output.
          </p>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Toggles and Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 lg:col-span-1">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Prompt Component Toggles</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Turn modules on or off to conduct interactive ablation experiments.
            </p>
          </div>

          {/* 5 Component Toggles */}
          <div className="space-y-3">
            {toggles.map((t) => (
              <div
                key={t.label}
                onClick={() => t.set(!t.state)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  t.state
                    ? 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70'
                    : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${t.state ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {t.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.state ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {t.state ? 'ENABLED' : 'STRIPPED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Preset Buttons for Quick Ablation */}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setIncludeRole(true);
                setIncludeTone(true);
                setIncludeFormat(true);
                setIncludeExamples(true);
                setIncludeInstructions(true);
              }}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition-colors"
            >
              Reset Full Prompt
            </button>
            <button
              onClick={() => {
                setIncludeRole(false);
                setIncludeTone(false);
                setIncludeFormat(false);
                setIncludeExamples(false);
                setIncludeInstructions(false);
              }}
              className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-xl border border-rose-200 transition-colors"
            >
              Set Minimal Prompt
            </button>
          </div>

          {/* Persona & Topic Selectors */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Concept Topic</label>
              <select
                value={selectedConcept}
                onChange={(e) => {
                  setSelectedConcept(e.target.value);
                  setCustomConcept('');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {concepts.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Persona Style</label>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {personas.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunPlayground}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Output...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Modular Generation</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Columns: Side-by-Side Prompt vs Response */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-2">
          
          {/* Box 1: Full Generated Prompt */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-slate-100 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Full Generated Prompt ({activeComponents.length}/7 Active)
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(generatedPrompt, 'prompt')}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[500px]">
                {generatedPrompt}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Dynamic prompt length: {generatedPrompt.length} chars</span>
              <span>Modules: {activeComponents.join(', ')}</span>
            </div>
          </div>

          {/* Box 2: AI Response */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Model Response
                  </span>
                </div>
                {aiResponse && (
                  <button
                    onClick={() => handleCopy(aiResponse, 'response')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[500px]">
                {aiResponse ? (
                  aiResponse
                ) : (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Sliders className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-medium">Click "Run Modular Generation" to generate explanation with your active component toggles.</p>
                  </div>
                )}
              </div>
            </div>

            {latency && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>Latency: {latency}ms</span>
                </span>
                <span className="font-semibold text-emerald-600">Generated successfully</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
