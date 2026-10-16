# Smart Contract Copilot

> *The Canva for Move smart contracts: build visually, get AI help at the edges, verify everything before it touches the chain.*

A visual-first web platform for designing, verifying, optimizing, and deploying Aptos Move smart contracts with deterministic code generation, automated rule-based security audits, measured gas optimization, plain-English permissions analysis, and exportable PDF audit reports.

Drive Link : https://drive.google.com/drive/folders/1uYyNpsGkhI1vezMmkpjGHSNwMyEzkb-L?usp=drive_link
Youtube Link : https://youtu.be/c9g5KWalK-U

---

## Architecture Overview

```
smart-contract-copilot/
├── backend/                  # Python Flask API & Engines
│   ├── app/
│   │   ├── api/              # REST Endpoints (Auth, Projects, Graph, Compile, Audit, Gas, Deploy, etc.)
│   │   ├── core/
│   │   │   ├── graph/        # Graph schema, parsing & validation
│   │   │   ├── generator/    # Deterministic Move code generator (Graph -> IR -> Jinja2 -> Move Package)
│   │   │   ├── audit/        # Rule-based static security analyzer (SC-001 through SC-016)
│   │   │   ├── gas/          # Measured gas analyzer & verified optimizer
│   │   │   ├── permissions/  # Deterministic permissions matrix & funds flow explainer
│   │   │   ├── ai/           # Structured prompt-to-graph & compiler diagnostic explainer
│   │   │   ├── sandbox/      # Isolated runner with Aptos CLI & diagnostics parser
│   │   │   └── report/       # Reproducible PDF audit report generator
│   │   ├── models/           # MongoDB document schemas
│   │   └── workers/          # Async task queue worker (Compile, Audit, Gas, PDF)
│   ├── specs/                # Declarative block specifications, templates, and learning concepts
│   └── tests/                # Unit tests, golden snapshots, and seeded-bug suite
├── frontend/                 # Next.js Web Application
│   └── src/
│       ├── app/              # Next.js routes (Landing, Dashboard, Workspace)
│       ├── components/
│       │   ├── canvas/       # React Flow canvas, block nodes, typed ports, minimap
│       │   ├── palette/      # Categorized block palette & template picker
│       │   ├── panels/       # Right-side panels (Properties, Live Code, Audit, Gas, Permissions, Learn)
│       │   ├── editor/       # Monaco Editor with Move syntax & eject-to-editor
│       │   ├── ai/           # Prompt-to-blocks drawer with visual diff preview
│       │   ├── deploy/       # Aptos wallet connection (Petra) & testnet deploy flow
│       │   ├── common/       # Header, risk gauges, console bar, modals
│       │   └── learning/     # Move concept cards & interactive tooltips
│       ├── lib/              # API client, graph helpers, wallet utilities
│       ├── types/            # TypeScript schemas (Graph, Blocks, Audit, Gas, Permissions)
│       └── styles/           # Design system tokens and styles
└── docker/                   # Ephemeral sandbox container & local multi-service orchestration
```

---

## Core Principles from PRD
1. **Visual-First:** Drag-and-drop canvas is the core product, not a chat wrapper.
2. **Deterministic Over Generative:** Code generation, audits, gas measurements, and permissions are rule-based or measured. AI is never used to guess raw code.
3. **Verified Pipeline:** One connected flow: Visual assembly -> Deterministic Move generation -> Compile -> Audit -> Measured Gas -> Permissions Matrix -> Wallet Deploy.
4. **Learning Mode:** Every block teaches the underlying Move concept (resources, abilities, capabilities, signers).

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ & pip

### Step 1: Start the Backend API (Terminal 1)
```bash
cd backend
python3 run.py
```
> The API server will start on **`http://localhost:5000`** and automatically connects to MongoDB Atlas, Upstash Redis, and Google Gemini AI via `backend/.env`.

### Step 2: Start the Next.js Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
> The web application will launch at **`http://localhost:3000`**.

### Running Tests
- **Backend Test Suite (15 unit tests):**
  ```bash
  python3 -m pytest backend/tests
  ```
- **Frontend Production Build:**
  ```bash
  cd frontend && npm run build
  ```
