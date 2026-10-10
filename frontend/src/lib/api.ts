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
