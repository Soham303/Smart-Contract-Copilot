'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BlockPalette } from '../../../components/palette/BlockPalette';
import { TemplatePicker } from '../../../components/palette/TemplatePicker';
import { BlockNode } from '../../../components/canvas/BlockNode';
import { PropertiesPanel } from '../../../components/panels/PropertiesPanel';
import { LiveCodePanel } from '../../../components/panels/LiveCodePanel';
import { AuditPanel } from '../../../components/panels/AuditPanel';
import { GasPanel } from '../../../components/panels/GasPanel';
import { PermissionsPanel } from '../../../components/panels/PermissionsPanel';
import { LearningPanel } from '../../../components/panels/LearningPanel';
import { PromptDrawer } from '../../../components/ai/PromptDrawer';
import { DeployModal } from '../../../components/deploy/DeployModal';

import {
  fetchBlocks,
  fetchTemplates,
  fetchConcepts,
  generateCode,
  validateGraph,
  runAudit,
  runGasAnalysis,
  runPermissions,
  generateReport,
} from '../../../lib/api';

import { BlockSpec } from '../../../types/blocks';
import { AuditFinding } from '../../../types/audit';
import { GasReportData } from '../../../types/gas';
import { PermissionsData } from '../../../types/permissions';

interface BlockNodeData {
  spec: BlockSpec;
  props: Record<string, any>;
  status?: 'valid' | 'warning' | 'error';
  statusMessage?: string;
  learningMode?: boolean;
  isSelected?: boolean;
  [key: string]: unknown;
}

export default function WorkspacePage({ params }: { params: { projectId: string } }) {
  // State
  const [categories, setCategories] = useState<string[]>([]);
  const [blocksList, setBlocksList] = useState<BlockSpec[]>([]);
  const [groupedBlocks, setGroupedBlocks] = useState<Record<string, BlockSpec[]>>({});
  const [templates, setTemplates] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'properties' | 'code' | 'audit' | 'gas' | 'permissions' | 'learn'>('properties');
  const [learningMode, setLearningMode] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Verification & Generation State
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [sourceMap, setSourceMap] = useState<any>({});
  const [riskScore, setRiskScore] = useState<number>(100);
  const [riskBand, setRiskBand] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [gasReport, setGasReport] = useState<GasReportData>({ entries: [], optimizations: [] });
  const [permissionsData, setPermissionsData] = useState<PermissionsData>({
    matrix: [],
    keyAnswers: { whoCanMint: '', whoCanWithdraw: '', whoCanPause: '', canSupplyGrow: '', canContractBeUpgraded: '' },
    mutableParameters: [],
    fundsFlow: { inflow: '', outflow: '', controllers: [] },
  });

  // Modals
  const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState('Console: Ready • Aptos Testnet');

  // React Flow Nodes & Edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BlockNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Node types registration
  const nodeTypes = useMemo(() => ({ blockNode: BlockNode }), []);

  // Construct current ContractGraph object from canvas
  const getGraphObject = useCallback((currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]) => {
    return {
      schemaVersion: '1.0',
      target: 'aptos-move',
      meta: {
        name: 'MyContract',
        moduleName: 'my_contract',
        version: '0.1.0',
      },
      blocks: currentNodes.map(n => ({
        id: n.id,
        type: n.data.spec?.type || 'token.fungible',
        props: n.data.props || {},
        position: n.position,
      })),
      edges: currentEdges.map(e => ({
        from: e.source,
        fromPort: e.sourceHandle || '',
        to: e.target,
        toPort: e.targetHandle || '',
      })),
    };
  }, []);

  // Trigger code generation, audit, gas, and permissions check (<500ms)
  const triggerPipeline = useCallback(async (currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]) => {
    const graph = getGraphObject(currentNodes, currentEdges);
    setConsoleMsg('Compiling & verifying Move pipeline...');
    try {
      const [genRes, permRes] = await Promise.all([
        generateCode(graph),
        runPermissions(graph),
      ]);

      if (genRes.files) {
        setGeneratedFiles(genRes.files);
        setSourceMap(genRes.sourceMap || {});

        const code = genRes.files[Object.keys(genRes.files)[1]] || genRes.files[Object.keys(genRes.files)[0]] || '';
        const [auditRes, gasRes] = await Promise.all([
          runAudit(code, graph),
          runGasAnalysis(code),
        ]);

        if (auditRes.result) {
          setRiskScore(auditRes.result.riskScore);
          setRiskBand(auditRes.result.riskBand);
          setFindings(auditRes.result.findings || []);
        }

        if (gasRes.result) {
          setGasReport(gasRes.result);
        }

        setConsoleMsg(`Verified: ${auditRes.result?.findings?.length || 0} findings | Risk Score: ${auditRes.result?.riskScore || 100}/100`);
      }

      if (permRes.result) {
        setPermissionsData(permRes.result);
      }
    } catch (e) {
      console.error('Pipeline check error:', e);
      setConsoleMsg('Check error: unable to verify pipeline');
    }
  }, [getGraphObject]);

  // Convert graph to React Flow nodes/edges
  const loadGraphIntoCanvas = useCallback((graph: any, allBlocks: BlockSpec[]) => {
    const specsMap: Record<string, BlockSpec> = {};
    allBlocks.forEach(b => { specsMap[b.type] = b; });

    const newNodes: Node<BlockNodeData>[] = (graph.blocks || []).map((b: any, idx: number) => {
      const spec = specsMap[b.type] || {
        type: b.type,
        category: 'Token',
        title: b.type,
        ports: { in: [], out: [] },
        props: {},
      };

      return {
        id: b.id,
        type: 'blockNode',
        position: b.position || { x: 80 + (idx % 3) * 260, y: 80 + Math.floor(idx / 3) * 200 },
        data: {
          spec,
          props: b.props || {},
          status: 'valid',
          learningMode: true,
          isSelected: false,
        },
      };
    });

    const newEdges: Edge[] = (graph.edges || []).map((e: any, idx: number) => ({
      id: `e_${e.from}_${e.to}_${idx}`,
      source: e.from,
      sourceHandle: e.fromPort,
      target: e.to,
      targetHandle: e.toPort,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    triggerPipeline(newNodes, newEdges);
  }, [setNodes, setEdges, triggerPipeline]);

  // Fetch initial catalog & template data
  useEffect(() => {
    async function init() {
      try {
        const [blocksRes, templatesRes, conceptsRes] = await Promise.all([
          fetchBlocks(),
          fetchTemplates(),
          fetchConcepts(),
        ]);

        if (blocksRes.categories) setCategories(blocksRes.categories);
        if (blocksRes.blocks) setBlocksList(blocksRes.blocks);
        if (blocksRes.grouped) setGroupedBlocks(blocksRes.grouped);
        if (templatesRes.templates) setTemplates(templatesRes.templates);
        if (conceptsRes.concepts) setConcepts(conceptsRes.concepts);

        // Load Fungible Token template by default
        const defaultTmpl = templatesRes.templates?.find((t: any) => t.id === 'template_fungible_token') || templatesRes.templates?.[0];
        if (defaultTmpl?.graph) {
          loadGraphIntoCanvas(defaultTmpl.graph, blocksRes.blocks || []);
        }
      } catch (e) {
        console.error('Initialization error:', e);
      }
    }
    init();
  }, [loadGraphIntoCanvas]);

  // Connect ports
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const updated = addEdge({ ...connection, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }, eds);
        triggerPipeline(nodes, updated);
        return updated;
      });
    },
    [nodes, setEdges, triggerPipeline]
  );

  // Drag and Drop block onto canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const spec: BlockSpec = JSON.parse(rawData);
      const newId = `b_${Date.now().toString().slice(-4)}`;

      const newNode: Node<BlockNodeData> = {
        id: newId,
        type: 'blockNode',
        position: { x: event.clientX - 320, y: event.clientY - 120 },
        data: {
          spec,
          props: Object.fromEntries(Object.entries(spec.props || {}).map(([k, v]) => [k, v.default ?? ''])),
          status: 'valid',
          learningMode,
        },
      };

      setNodes((nds) => {
        const updated = nds.concat(newNode);
        triggerPipeline(updated, edges);
        return updated;
      });
    },
    [learningMode, edges, setNodes, triggerPipeline]
  );

  // Update Block Properties
  const handleUpdateProps = (blockId: string, updatedProps: Record<string, any>) => {
    setNodes((nds) => {
      const updated = nds.map((n) => (n.id === blockId ? { ...n, data: { ...n.data, props: updatedProps } } : n));
      triggerPipeline(updated, edges);
      return updated;
    });
  };

  // Node selection
  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
    setActiveTab('properties');
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // PDF Report Export (PRD FR-13.1 - 13.4)
  const handleExportReport = async () => {
    try {
      setConsoleMsg('Generating PDF Audit Report...');
      const payload = {
        projectName: 'MyContract',
        audit: { riskScore, riskBand, findings },
        gas: gasReport,
        permissions: permissionsData,
      };
      const res = await generateReport(payload);
      if (res.html) {
        const blob = new Blob([res.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setConsoleMsg('Audit Report exported successfully!');
      }
    } catch (e) {
      console.error(e);
      setConsoleMsg('Report export failed');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top bar (PRD 20.1) */}
      <header style={{ height: '56px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', background: 'var(--bg-secondary)', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.05rem' }}>
            Smart Contract Copilot
          </span>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aptos Testnet</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setIsPromptDrawerOpen(true)}
            id="ai-prompt-btn"
            style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ✨ AI Prompt-to-Blocks
          </button>
          <button
            onClick={() => triggerPipeline(nodes, edges)}
            id="check-btn"
            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Check (Verify)
          </button>
          <button
            onClick={handleExportReport}
            id="report-btn"
            style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem' }}
          >
            Export PDF Report
          </button>
          <button
            onClick={() => setIsDeployModalOpen(true)}
            id="deploy-btn"
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Deploy (Testnet)
          </button>
        </div>
      </header>

      {/* Main Workspace Layout (PRD 20.1) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Palette & Templates */}
        <aside style={{ width: '280px', borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <BlockPalette
            categories={categories}
            groupedBlocks={groupedBlocks}
            onSelectBlock={(spec) => {
              const newId = `b_${Date.now().toString().slice(-4)}`;
              const newNode: Node<BlockNodeData> = {
                id: newId,
                type: 'blockNode',
                position: { x: 200, y: 150 },
                data: {
                  spec,
                  props: Object.fromEntries(Object.entries(spec.props || {}).map(([k, v]) => [k, v.default ?? ''])),
                  status: 'valid',
                  learningMode,
                },
              };
              setNodes((nds) => {
                const updated = nds.concat(newNode);
                triggerPipeline(updated, edges);
                return updated;
              });
            }}
          />
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <TemplatePicker
              templates={templates}
              onSelectTemplate={(tmpl) => loadGraphIntoCanvas(tmpl.graph, blocksList)}
            />
          </div>
        </aside>

        {/* Center: React Flow Canvas */}
        <main
          style={{ flex: 1, position: 'relative', background: '#070a10' }}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* Canvas Floating Toolbar */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
            <button
              onClick={() => setLearningMode(!learningMode)}
              style={{
                padding: '6px 12px',
                background: learningMode ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-secondary)',
                border: `1px solid ${learningMode ? '#3b82f6' : 'var(--border-color)'}`,
                borderRadius: '6px',
                color: learningMode ? '#60a5fa' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Learning Mode: {learningMode ? 'ON 📖' : 'OFF'}
            </button>
            <button
              onClick={() => { setNodes([]); setEdges([]); }}
              style={{
                padding: '6px 12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              Clear Canvas
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', fill: '#fff' }} />
            <MiniMap nodeColor="#3b82f6" maskColor="rgba(0,0,0,0.6)" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
          </ReactFlow>
        </main>

        {/* Right Tabbed Panels */}
        <aside style={{ width: '440px', borderLeft: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', background: '#0b0f19' }}>
            <button
              onClick={() => setActiveTab('properties')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'properties' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'properties' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab('code')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'code' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'code' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'audit' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'audit' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Audit ({findings.length})
            </button>
            <button
              onClick={() => setActiveTab('gas')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'gas' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'gas' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Gas
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'permissions' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'permissions' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              style={{
                flex: 1,
                padding: '10px 4px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'learn' ? '#fff' : 'var(--text-muted)',
                borderBottom: activeTab === 'learn' ? '2px solid #3b82f6' : 'none',
                fontWeight: 600,
              }}
            >
              Learn
            </button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            {activeTab === 'properties' && (
              <PropertiesPanel
                selectedBlock={selectedNode ? { id: selectedNode.id, type: selectedNode.data.spec?.type, props: selectedNode.data.props, spec: selectedNode.data.spec } : null}
                onUpdateProps={handleUpdateProps}
                onDeleteBlock={(id) => setNodes((nds) => nds.filter((n) => n.id !== id))}
              />
            )}
            {activeTab === 'code' && (
              <LiveCodePanel
                files={generatedFiles}
                sourceMap={sourceMap}
              />
            )}
            {activeTab === 'audit' && (
              <AuditPanel
                riskScore={riskScore}
                riskBand={riskBand}
                findings={findings}
                onSelectBlock={(bId) => { setSelectedNodeId(bId); setActiveTab('properties'); }}
                onRefreshAudit={() => triggerPipeline(nodes, edges)}
              />
            )}
            {activeTab === 'gas' && (
              <GasPanel
                gasReport={gasReport}
              />
            )}
            {activeTab === 'permissions' && (
              <PermissionsPanel
                permissionsData={permissionsData}
              />
            )}
            {activeTab === 'learn' && (
              <LearningPanel
                concepts={concepts}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Console Bar (PRD 20.1) */}
      <footer style={{ height: '36px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>{consoleMsg}</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Deterministic Jinja2 Move Generator • Aptos v1.0</span>
      </footer>

      {/* Modals */}
      <PromptDrawer
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
        onApplyGraph={(graph) => loadGraphIntoCanvas(graph, blocksList)}
      />

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        hasCompilePassed={true}
        criticalIssuesCount={findings.filter(f => f.severity === 'Critical').length}
        moduleName="my_contract"
      />
    </div>
  );
}
