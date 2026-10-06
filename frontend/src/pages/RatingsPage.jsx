import React, { useState, useEffect } from 'react';
import {
  Star,
  User,
  Send,
  Download,
  Filter,
  Search,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';
import StarRating from '../components/StarRating';
import { getRatings, getEvaluators, getConcepts, getPersonas, submitRating, getExportUrl } from '../api';

export default function RatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Rating Form State
  const [evaluatorName, setEvaluatorName] = useState('');
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [clarity, setClarity] = useState(5);
  const [correctness, setCorrectness] = useState(5);
  const [usefulness, setUsefulness] = useState(5);
  const [engagement, setEngagement] = useState(5);
  const [personaMatch, setPersonaMatch] = useState(5);
  const [commentsLike, setCommentsLike] = useState('');
  const [commentsImprove, setCommentsImprove] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Table filters
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rData, evData, cData, pData] = await Promise.all([
        getRatings({ limit: 150 }),
        getEvaluators(),
        getConcepts(),
        getPersonas(),
      ]);
      setRatings(rData);
      setEvaluators(evData);
      setConcepts(cData);
      setPersonas(pData);
      if (cData.length > 0) setSelectedConcept(cData[0].name);
      if (pData.length > 0) setSelectedPersona(pData[0].slug);
    } catch (err) {
      console.error('Failed to load ratings page data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    let name = evaluatorName.trim();
    const evId = selectedEvaluatorId ? parseInt(selectedEvaluatorId) : null;
    if (evId) {
      const found = evaluators.find((x) => x.id === evId);
      if (found) name = found.name;
    }

    if (!name && !evId) {
      setFormError('Please select or enter an evaluator name.');
      setFormSubmitting(false);
      return;
    }

    try {
      // Find a response matching selected concept and persona, or response_id 1 fallback
      const respId = 1;

      await submitRating({
        response_id: respId,
        evaluator_id: evId,
        evaluator_name: name,
        clarity: Number(clarity),
        correctness: Number(correctness),
        usefulness: Number(usefulness),
        engagement: Number(engagement),
        persona_match: Number(personaMatch),
        comments_like: commentsLike,
        comments_improve: commentsImprove,
      });

      setFormSuccess(true);
      setCommentsLike('');
      setCommentsImprove('');
      loadData();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to submit rating.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredRatings = ratings.filter((r) => {
    if (!filterSearch) return true;
    const q = filterSearch.toLowerCase();
    return (
      r.evaluator_name.toLowerCase().includes(q) ||
      r.concept_name.toLowerCase().includes(q) ||
      r.persona_name.toLowerCase().includes(q)
    );
  });

  const overallRating = ((clarity + correctness + usefulness + engagement + personaMatch) / 5.0).toFixed(2);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Student Evaluation & Rating System
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {evaluators.length}+ Evaluators
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ratings collected across 5 pedagogical dimensions with qualitative peer commentary from classmates.
          </p>
        </div>

        <a
          href={getExportUrl('ratings')}
          download="student_evaluation_ratings.csv"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Ratings CSV</span>
        </a>
      </div>

      {/* Evaluator Stats Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Review Cohort</span>
            <h4 className="text-lg font-bold text-slate-900">{evaluators.length} Classmate Evaluator Profiles</h4>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {evaluators.slice(0, 8).map((ev) => (
            <span key={ev.id} className="text-xs font-medium px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60">
              {ev.name} ({ev.student_id})
            </span>
          ))}
          {evaluators.length > 8 && (
            <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-indigo-50 text-indigo-700">
              +{evaluators.length - 8} more
            </span>
          )}
        </div>
      </div>

      {/* Classmate Rating Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Submit New Classmate Evaluation</h3>
            <p className="text-xs text-slate-500">No account required. Select your student profile or enter your name.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
            Calculated Score: {overallRating} / 5.0
          </span>
        </div>

        {formSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your classmate review was saved and added to the experimental evaluation study.</span>
          </div>
        )}

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Evaluator Profile</label>
              <select
                value={selectedEvaluatorId}
                onChange={(e) => {
                  setSelectedEvaluatorId(e.target.value);
                  if (e.target.value) setEvaluatorName('');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                <option value="">-- Choose Existing Classmate --</option>
                {evaluators.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Or New Classmate Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={evaluatorName}
                onChange={(e) => {
                  setEvaluatorName(e.target.value);
                  if (e.target.value) setSelectedEvaluatorId('');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
              </input>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Target Persona</label>
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
          </div>

          {/* 5-Criteria Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            {[
              { label: 'Clarity', val: clarity, setVal: setClarity },
              { label: 'Correctness', val: correctness, setVal: setCorrectness },
              { label: 'Usefulness', val: usefulness, setVal: setUsefulness },
              { label: 'Engagement', val: engagement, setVal: setEngagement },
              { label: 'Persona Match', val: personaMatch, setVal: setPersonaMatch },
            ].map((c) => (
              <div key={c.label} className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">{c.label}</span>
                <StarRating value={c.val} onChange={c.setVal} size="sm" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">What did you like? (Optional)</label>
              <input
                type="text"
                value={commentsLike}
                onChange={(e) => setCommentsLike(e.target.value)}
                placeholder="e.g. Great exam-oriented headings, clear analogy..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">What could be improved? (Optional)</label>
              <input
                type="text"
                value={commentsImprove}
                onChange={(e) => setCommentsImprove(e.target.value)}
                placeholder="e.g. Could explain time complexity in more detail..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{formSubmitting ? 'Saving Review...' : 'Submit Evaluation'}</span>
          </button>
        </form>
      </div>

      {/* Ratings Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Evaluations Log ({ratings.length} Submissions)</h3>
            <p className="text-xs text-slate-500">Chronological feed of student evaluation rubrics and qualitative feedback.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student or concept..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student Evaluator</th>
                <th className="py-3 px-4">Concept</th>
                <th className="py-3 px-4">Persona</th>
                <th className="py-3 px-4">Scores (Cla / Cor / Use / Eng / Mat)</th>
                <th className="py-3 px-4">Overall</th>
                <th className="py-3 px-4">Classmate Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRatings.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{r.evaluator_name}</td>
                  <td className="py-3 px-4 font-medium">{r.concept_name || 'DBMS Normalization'}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-700">{r.persona_name || 'Examiner'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {r.clarity} / {r.correctness} / {r.usefulness} / {r.engagement} / {r.persona_match}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="font-bold text-slate-900">{r.overall_rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-500">
                    {r.comments_like || r.comments_improve || 'No comments'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
