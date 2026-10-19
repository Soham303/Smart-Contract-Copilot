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

function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
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

export async function fetchUserActivities(limit: number = 20) {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE}/auth/activity?limit=${limit}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
}

// ==================== PROJECTS ====================
export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function createProject(data: { name?: string; mode?: string; templateId?: string; graph?: any; network?: string }) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getProject(projectId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    mode?: string;
    graph?: any;
    network?: string;
    code?: string;
    files?: Record<string, string>;
  }
) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(projectId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
}

export async function duplicateProject(projectId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/duplicate`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.json();
}

export async function downloadProjectZip(projectId: string, filename?: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/export`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to export Move package');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `contract_${projectId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== BLOCKS & TEMPLATES ====================
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

export async function generateAiCode(graph: any, prompt?: string, apiKey?: string, model?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['X-AI-API-Key'] = apiKey;
  }
  const res = await fetch(`${API_BASE}/ai/generate-code`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ graph, prompt, apiKey, model }),
  });
  return res.json();
}

// ==================== JOBS ====================
export async function getJobStatus(jobId: string) {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
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

export async function downloadAuditReportPdf(payload: any, filename: string = 'audit_report.pdf') {
  const res = await fetch(`${API_BASE}/reports/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate PDF report');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== DEPLOY ====================
export async function buildDeployPayload(files: Record<string, string>, network: string = 'testnet') {
  const res = await fetch(`${API_BASE}/deploy/payload`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ files, network }),
  });
  return res.json();
}

export async function recordDeployment(data: { projectId: string; network: string; address: string; txHash: string; codeHash?: string }) {
  const res = await fetch(`${API_BASE}/deploy/record`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function publishContract(data: {
  projectId: string;
  files: Record<string, string>;
  network: string;
  address?: string;
  moduleName?: string;
}) {
  const res = await fetch(`${API_BASE}/deploy/publish`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchDeployments(projectId?: string) {
  const url = projectId ? `${API_BASE}/deploy/history?projectId=${encodeURIComponent(projectId)}` : `${API_BASE}/deploy/history`;
  const res = await fetch(url, {
    headers: authHeaders(),
  });
  return res.json();
}

// ==================== LOGS ====================
export async function fetchSystemLogs(category?: string, projectId?: string, limit = 100) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (projectId) params.append('projectId', projectId);
  params.append('limit', String(limit));

  const res = await fetch(`${API_BASE}/auth/logs?${params.toString()}`, {
    headers: authHeaders(),
  });
  return res.json();
}

