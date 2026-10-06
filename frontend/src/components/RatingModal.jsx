import React, { useState, useEffect } from 'react';
import { X, Star, ThumbsUp, MessageSquare, User, Send, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';
import { getEvaluators, submitRating } from '../api';

export default function RatingModal({ responseId, conceptName, personaName, isOpen, onClose, onRatingSubmitted }) {
  const [evaluators, setEvaluators] = useState([]);
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('');
  const [customName, setCustomName] = useState('');
  const [clarity, setClarity] = useState(5);
  const [correctness, setCorrectness] = useState(5);
  const [usefulness, setUsefulness] = useState(5);
  const [engagement, setEngagement] = useState(5);
  const [personaMatch, setPersonaMatch] = useState(5);
  const [commentsLike, setCommentsLike] = useState('');
  const [commentsImprove, setCommentsImprove] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadEvaluators();
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const loadEvaluators = async () => {
    try {
      const data = await getEvaluators();
      setEvaluators(data);
      if (data.length > 0 && !selectedEvaluatorId) {
        setSelectedEvaluatorId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load evaluators', err);
    }
  };

  if (!isOpen) return null;

  const overallRating = ((clarity + correctness + usefulness + engagement + personaMatch) / 5.0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let evaluatorName = customName.trim();
    let evId = selectedEvaluatorId ? parseInt(selectedEvaluatorId) : null;

    if (!evId && !evaluatorName) {
      setError('Please select an evaluator or enter your name.');
      setLoading(false);
      return;
    }

    if (evId) {
      const found = evaluators.find((ev) => ev.id === evId);
      if (found) evaluatorName = found.name;
    }

    try {
      await submitRating({
        response_id: responseId,
        evaluator_id: evId,
        evaluator_name: evaluatorName,
        clarity: Number(clarity),
        correctness: Number(correctness),
        usefulness: Number(usefulness),
        engagement: Number(engagement),
        persona_match: Number(personaMatch),
        comments_like: commentsLike,
        comments_improve: commentsImprove,
      });

      setSuccess(true);
      if (onRatingSubmitted) onRatingSubmitted();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Student Explanation Evaluation</h3>
            <p className="text-xs text-slate-500">
              Concept: <span className="font-semibold text-slate-800">{conceptName}</span> • Persona: <span className="font-semibold text-indigo-600">{personaName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Rating Submitted Successfully!</h4>
            <p className="text-xs text-slate-500">Thank you for contributing to the prompt engineering evaluation study.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Evaluator Identity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Evaluator (Classmate Profile)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={selectedEvaluatorId}
                  onChange={(e) => {
                    setSelectedEvaluatorId(e.target.value);
                    if (e.target.value) setCustomName('');
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose Existing Classmate (15+ Available) --</option>
                  {evaluators.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.student_id || ev.department})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Or enter new classmate name..."
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    if (e.target.value) setSelectedEvaluatorId('');
                  }}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 5-Criteria Sliders & Star Ratings */}
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">5-Point Evaluation Rubric</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Overall: {overallRating} / 5.0
                </span>
              </div>

              {[
                { label: '1. Clarity', desc: 'Is the explanation easy to read and mentally comprehend?', val: clarity, setVal: setClarity },
                { label: '2. Correctness', desc: 'Is the technical content accurate and factually sound?', val: correctness, setVal: setCorrectness },
                { label: '3. Usefulness', desc: 'How well does this help a student pass exams or viva?', val: usefulness, setVal: setUsefulness },
                { label: '4. Engagement', desc: 'Is the tone engaging, interesting, and motivating?', val: engagement, setVal: setEngagement },
                { label: '5. Persona Match', desc: 'Does the response strongly reflect the selected persona style?', val: personaMatch, setVal: setPersonaMatch },
              ].map((c) => (
                <div key={c.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1">
                  <div>
                    <span className="text-xs font-bold text-slate-800">{c.label}</span>
                    <p className="text-[11px] text-slate-500">{c.desc}</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-1 sm:pt-0">
                    <StarRating value={c.val} onChange={c.setVal} size="md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 mb-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What did you like about this explanation? (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={commentsLike}
                  onChange={(e) => setCommentsLike(e.target.value)}
                  placeholder="e.g. Great structured format, the real-world analogy made it intuitive..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>What could be improved? (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={commentsImprove}
                  onChange={(e) => setCommentsImprove(e.target.value)}
                  placeholder="e.g. Include a code example, explain boundary conditions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Save Student Evaluation'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
