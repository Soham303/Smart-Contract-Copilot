const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('scc_token');
}

export function setStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('scc_token', token);
  }
}

export function removeStoredToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('scc_token');
    localStorage.removeItem('scc_user');
  }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function registerUser(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function getAuthProfile() {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
}

export async function fetchBlocks() {
  const res = await fetch(`${API_BASE}/blocks`);
  return res.json();
}

export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/templates`);
  return res.json();
}

export async function validateGraph(graph: any) {
  const res = await fetch(`${API_BASE}/graph/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graph),
  });
  return res.json();
}

export async function generateCode(graph: any) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graph),
  });
  return res.json();
}

export async function runAudit(code: string, graph: any) {
  const res = await fetch(`${API_BASE}/jobs/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, graph }),
  });
  return res.json();
}

export async function runGasAnalysis(code: string) {
  const res = await fetch(`${API_BASE}/jobs/gas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return res.json();
}

export async function runPermissions(graph: any) {
  const res = await fetch(`${API_BASE}/jobs/permissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ graph }),
  });
  return res.json();
}

export async function compileContract(files: Record<string, string>) {
  const res = await fetch(`${API_BASE}/jobs/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });
  return res.json();
}

export async function promptToGraph(prompt: string, apiKey?: string) {
  const res = await fetch(`${API_BASE}/ai/prompt-to-graph`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, apiKey }),
  });
  return res.json();
}

export async function fetchConcepts() {
  const res = await fetch(`${API_BASE}/concepts`);
  return res.json();
}

export async function generateReport(payload: any) {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
