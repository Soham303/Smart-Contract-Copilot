const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export async function promptToGraph(prompt: string) {
  const res = await fetch(`${API_BASE}/ai/prompt-to-graph`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
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
