import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import ComparePersonas from './pages/ComparePersonas';
import ExperimentTable from './pages/ExperimentTable';
import PromptPlayground from './pages/PromptPlayground';
import AblationStudy from './pages/AblationStudy';
import RatingsPage from './pages/RatingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResearchSummary from './pages/ResearchSummary';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/compare" element={<ComparePersonas />} />
          <Route path="/experiments" element={<ExperimentTable />} />
          <Route path="/playground" element={<PromptPlayground />} />
          <Route path="/ablation" element={<AblationStudy />} />
          <Route path="/ratings" element={<RatingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/research" element={<ResearchSummary />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
