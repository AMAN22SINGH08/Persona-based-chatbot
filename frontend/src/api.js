const API_BASE = '/api';

export async function fetchJson(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// Concepts & Personas
export const getConcepts = () => fetchJson('/concepts');
export const getPersonas = () => fetchJson('/personas');

// Chat & Compare
export const sendChatMessage = (data) =>
  fetchJson('/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const comparePersonas = (data) =>
  fetchJson('/compare', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Experiments
export const getExperiments = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/experiments${query ? `?${query}` : ''}`);
};

export const getExperimentDetail = (id) => fetchJson(`/experiments/${id}`);

// Ratings & Evaluators
export const getRatings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/ratings${query ? `?${query}` : ''}`);
};

export const submitRating = (data) =>
  fetchJson('/ratings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getEvaluators = () => fetchJson('/evaluators');
export const createEvaluator = (data) =>
  fetchJson('/evaluators', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Ablation Study
export const getAblationConfigurations = () => fetchJson('/ablation/configurations');
export const getAblationSummary = () => fetchJson('/ablation/summary');
export const getAblationTests = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/ablation/tests${query ? `?${query}` : ''}`);
};
export const runAblationTest = (data) =>
  fetchJson('/ablation/run', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Analytics & Metrics
export const getAnalytics = () => fetchJson('/analytics');

// Settings & Dataset Controls
export const getSettings = () => fetchJson('/settings');
export const updateSettings = (data) =>
  fetchJson('/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const resetDemoData = () =>
  fetchJson('/settings/reset-demo', {
    method: 'POST',
  });

export const startFreshExperiment = () =>
  fetchJson('/settings/fresh-experiment', {
    method: 'POST',
  });

// CSV Exports
export const getExportUrl = (type) => `${API_BASE}/export/${type}`;
