import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Eye, Sliders, ShieldCheck } from 'lucide-react';

export default function PromptInspector({ breakdown, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('components'); // 'components' | 'raw'

  if (!isOpen || !breakdown) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(breakdown.full_prompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const components = [
    { label: 'Role & Persona', key: 'system_role', value: breakdown.system_role, badge: 'Role' },
    { label: 'Tone & Style', key: 'tone', value: breakdown.tone, badge: 'Tone' },
    { label: 'Output Format', key: 'format', value: breakdown.format, badge: 'Format' },
    { label: 'Few-Shot Examples', key: 'examples', value: breakdown.examples, badge: 'Examples' },
    { label: 'Step-by-Step Instructions', key: 'instructions', value: breakdown.instructions, badge: 'Instructions' },
    { label: 'Context Constraints', key: 'context', value: breakdown.context, badge: 'Context' },
    { label: 'Target User Concept', key: 'user_concept', value: breakdown.user_concept, badge: 'Concept' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Modular Prompt Inspector</h3>
              <p className="text-xs text-slate-500">
                Persona: <span className="font-semibold text-indigo-600">{breakdown.persona || 'Custom'}</span> • Active Modules: {breakdown.active_components?.length || 0}/7
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Copy Button */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('components')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'components'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
              Modular Breakdown
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'raw'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1.5" />
              Full Raw Prompt
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'components' ? (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex items-center justify-between">
                <span>Active Prompt Pipeline Components:</span>
                <div className="flex flex-wrap gap-1">
                  {breakdown.active_components?.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {components.map((item) => (
                <div
                  key={item.key}
                  className={`rounded-2xl border transition-all ${
                    item.value
                      ? 'border-slate-200/90 bg-white p-4 shadow-2xs'
                      : 'border-dashed border-slate-200 bg-slate-50/50 p-3 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.value
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {item.value ? 'Active' : 'Omitted in Prompt'}
                    </span>
                  </div>
                  {item.value ? (
                    <p className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {item.value}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Component disabled or stripped by ablation settings.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
              {breakdown.full_prompt || 'No prompt content.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Prompt Engineering in Practice • Modular Prompt Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
