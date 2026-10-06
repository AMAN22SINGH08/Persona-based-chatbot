import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Server,
  Sparkles
} from 'lucide-react';
import {
  getSettings,
  updateSettings,
  resetDemoData,
  startFreshExperiment,
  getExportUrl
} from '../api';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4o-mini');
  const [demoMode, setDemoMode] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      setBaseUrl(data.openai_base_url || 'https://api.openai.com/v1');
      setModel(data.openai_model || 'gpt-4o-mini');
      setDemoMode(data.is_demo_mode);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSettings({
        openai_api_key: apiKey || undefined,
        openai_base_url: baseUrl,
        openai_model: model,
        demo_mode: demoMode,
      });
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset database to the standard Demo Dataset with 20 concepts, 100 baseline experiments, and 16 evaluators?')) return;
    setResetting(true);
    try {
      const res = await resetDemoData();
      setResetMessage('Database restored to standard 100-experiment Demo Dataset.');
      setTimeout(() => setResetMessage(''), 4000);
    } catch (err) {
      console.error('Failed to reset demo data', err);
    } finally {
      setResetting(false);
    }
  };

  const handleStartFresh = async () => {
    if (!window.confirm('Start a fresh live experiment? This will clear student ratings so your classmates can submit new reviews.')) return;
    setResetting(true);
    try {
      const res = await startFreshExperiment();
      setResetMessage('Fresh experiment initiated. All student ratings cleared.');
      setTimeout(() => setResetMessage(''), 4000);
    } catch (err) {
      console.error('Failed to start fresh experiment', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          System Settings & Dataset Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure AI provider credentials, toggle between Demo Mode and Live API, and manage the student evaluation dataset.
        </p>
      </div>

      {resetMessage && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl flex items-center space-x-2 text-xs font-bold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* AI Provider Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">OpenAI-Compatible AI Provider</h3>
              <p className="text-xs text-slate-500">Supports OpenAI, Groq, DeepSeek, or local Ollama instances.</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              demoMode
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {demoMode ? 'Demo Mode (Offline)' : 'Live API Active'}
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              API Key (Optional in Demo Mode)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder={settings?.has_api_key ? '•••••••••••••••••••• (Configured)' : 'Enter OpenAI API Key (sk-...)'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Never exposed to the frontend browser bundle. If left blank, the application uses the high-fidelity built-in Academic Engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">API Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Model Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gpt-4o-mini, gpt-4o, etc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="demoModeToggle"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="demoModeToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Force Academic Demo Mode (Uses deterministic 100-baseline responses without consuming API tokens)
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Save Configuration'}
          </button>
        </form>
      </div>

      {/* Dataset & Experiment Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Dataset & Experiment Controls</h3>
            <p className="text-xs text-slate-500">Manage peer evaluation data and reset benchmark baselines.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Reset to Standard Demo Dataset</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Restores the 20 concepts, 5 personas, 100 baseline experiments, 16 student evaluators, and realistic rating distributions.
            </p>
            <button
              onClick={handleResetDemoData}
              disabled={resetting}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-colors"
            >
              Reset Demo Dataset
            </button>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
            <h4 className="font-bold text-indigo-950 text-xs">Start Fresh Experiment (Classroom Mode)</h4>
            <p className="text-[11px] text-indigo-800/80 leading-relaxed">
              Preserves the 20 concepts and 5 personas, but clears all ratings and evaluations so your classmates can submit new reviews from scratch.
            </p>
            <button
              onClick={handleStartFresh}
              disabled={resetting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Start Fresh Experiment
            </button>
          </div>

        </div>

      </div>

      {/* CSV Downloads Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Research Datasets (CSV)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Raw structured data suitable for quantitative analysis in Python pandas, Excel, or Google Sheets.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={getExportUrl('ratings')}
            download="ratings.csv"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Download Student Ratings CSV
          </a>
          <a
            href={getExportUrl('experiments')}
            download="experiments.csv"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Download 20-Concept Experiments CSV
          </a>
          <a
            href={getExportUrl('ablation')}
            download="ablation.csv"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Download Ablation Results CSV
          </a>
        </div>
      </div>

    </div>
  );
}
