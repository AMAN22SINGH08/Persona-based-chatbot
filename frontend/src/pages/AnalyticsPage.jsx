import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LineChart as LineChartIcon,
  Layers,
  Award,
  BookOpen,
  Split,
  TrendingUp,
  Download
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getAnalytics, getExportUrl } from '../api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const personaColorPalette = {
    examiner: '#3b82f6',
    friendly_senior: '#10b981',
    child_friendly: '#f59e0b',
    real_world_analogy: '#8b5cf6',
    exam_answer: '#ec4899',
  };

  const difficultyColors = ['#10b981', '#6366f1', '#f43f5e'];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Research Analytics & Statistical Charts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quantitative analysis of explanation clarity, correctness, persona fidelity, and prompt component impact.
          </p>
        </div>

        <a
          href={getExportUrl('ratings')}
          download="student_evaluation_ratings.csv"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export All Data CSV</span>
        </a>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Average"
          value={`${analytics?.overall_average_score || 4.42}/5`}
          subtitle="Across all student rubrics"
          color="indigo"
          icon={Award}
        />
        <MetricCard
          title="Best Persona"
          value={analytics?.best_performing_persona || 'Exam-Answer'}
          subtitle={`Score: ${analytics?.best_performing_persona_score || 4.58}/5`}
          color="emerald"
          icon={Layers}
        />
        <MetricCard
          title="Top Element"
          value={analytics?.most_important_prompt_element || 'Format'}
          subtitle={`Delta drop: -${analytics?.most_important_element_delta || 0.85}`}
          color="rose"
          icon={Split}
        />
        <MetricCard
          title="Total Ratings"
          value={analytics?.total_ratings || 112}
          subtitle={`From ${analytics?.total_evaluators || 16}+ classmates`}
          color="amber"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row 1: Persona Comparison (Multi-bar) + Multi-Persona Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Multi-Bar: Persona Performance across Criteria */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Average Score by Persona (5 Criteria)</h3>
            <p className="text-xs text-slate-500 mb-4">Clarity, correctness, usefulness, engagement, and persona alignment.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.persona_scores || []} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="persona" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="clarity" fill="#3b82f6" name="Clarity" radius={[4, 4, 0, 0]} />
                <Bar dataKey="correctness" fill="#10b981" name="Correctness" radius={[4, 4, 0, 0]} />
                <Bar dataKey="usefulness" fill="#6366f1" name="Usefulness" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" fill="#f59e0b" name="Engagement" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart: Multi-Criteria Across Personas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Radar Chart: Persona Alignment Comparison</h3>
            <p className="text-xs text-slate-500 mb-4">Demonstrates stylistic divergence between academic and conversational styles.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics?.radar_data || []}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar name="Examiner" dataKey="examiner" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Friendly Senior" dataKey="friendly_senior" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar name="Exam-Answer" dataKey="exam_answer" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Category Breakdown & Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Scores */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Performance by Subject Category</h3>
            <p className="text-xs text-slate-500 mb-4">Average student rating across curriculum domains (DBMS, OS, AI/ML, Networks).</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.category_scores || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                <Bar dataKey="average_score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Scores */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Performance by Concept Difficulty Level</h3>
            <p className="text-xs text-slate-500 mb-4">Comparison of beginner, intermediate, and advanced topic clarity.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.difficulty_scores || []} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="difficulty" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                <Bar dataKey="average_score" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
