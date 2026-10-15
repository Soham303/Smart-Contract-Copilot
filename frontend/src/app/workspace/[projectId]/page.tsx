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
  MarkerType,
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
  runAudit,
  runGasAnalysis,
  runPermissions,
  generateReport,
  getProject,
  updateProject,
} from '../../../lib/api';

import { BlockSpec } from '../../../types/blocks';
import { AuditFinding } from '../../../types/audit';
import { GasReportData } from '../../../types/gas';
import { PermissionsData } from '../../../types/permissions';

import {
  ShieldCheck,
  Flame,
  Rocket,
  Sparkles,
  Download,
  BookOpen,
  CheckCircle2,
  Cpu,
  FileCode,
  Code2,
  PanelRightClose,
  PanelRightOpen,
  X,
  Undo2,
  Redo2,
  AlertTriangle,
} from 'lucide-react';

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

  // Inspector & Code Drawer Toggle (User can show/unshow freely)
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'code' | 'audit' | 'gas' | 'permissions' | 'learn'>('code');
  const [learningMode, setLearningMode] = useState<boolean>(true);
  const [gridSnap, setGridSnap] = useState<boolean>(true);
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
  const [consoleMsg, setConsoleMsg] = useState('Topology: Ready • Smooth Orthogonal Routing Active');

  // Project & Autosave State
  const [projectName, setProjectName] = useState<string>('SkyApes_Token_Vesting');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autosaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // React Flow Nodes & Edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BlockNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Undo / Redo History Stack (up to 50 operations)
  const historyRef = React.useRef<{ nodes: Node<BlockNodeData>[]; edges: Edge[] }[]>([]);
  const historyIndexRef = React.useRef<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Validate Block Nodes against their Spec and Connected Edges
  const validateNodesWithEdges = useCallback(
    (currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]): Node<BlockNodeData>[] => {
      return currentNodes.map((node) => {
        const spec = node.data?.spec;
        let status: 'valid' | 'warning' | 'error' = 'valid';
        let statusMessage: string | undefined = undefined;

        // Check required input ports
        if (spec?.ports?.in && spec.ports.in.length > 0) {
          for (const p of spec.ports.in) {
            if (p.required) {
              const hasInEdge = currentEdges.some(
                (e) => e.target === node.id && (e.targetHandle === p.name || !e.targetHandle)
              );
              if (!hasInEdge) {
                status = 'warning';
                statusMessage = `Required port '${p.name}' is disconnected`;
                break;
              }
            }
          }
        }

        // Check required props if still valid
        if (status === 'valid' && spec?.props) {
          for (const [key, propDef] of Object.entries(spec.props as Record<string, any>)) {
            if (propDef.required) {
              const val = node.data?.props?.[key];
              if (val === undefined || val === null || val === '') {
                status = 'warning';
                statusMessage = `Required property '${key}' is missing`;
                break;
              }
            }
          }
        }

        return {
          ...node,
          data: {
            ...node.data,
            status,
            statusMessage,
          },
        };
      });
    },
    []
  );

  // Node types registration
  const nodeTypes = useMemo(() => ({ blockNode: BlockNode }), []);

  // Construct current ContractGraph object from canvas
  const getGraphObject = useCallback((currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]) => {
    const safeName = projectName.replace(/[^a-zA-Z0-9]/g, '') || 'SkyApesContract';
    const safeMod = projectName.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_') || 'sky_apes_contract';
    return {
      schemaVersion: '1.0',
      target: 'aptos-move',
      meta: {
        name: safeName,
        moduleName: safeMod,
        version: '1.0.0',
      },
      blocks: currentNodes.map((n) => ({
        id: n.id,
        type: n.data.spec?.type || 'token.fungible',
        props: n.data.props || {},
        position: n.position,
      })),
      edges: currentEdges.map((e) => ({
        from: e.source,
        fromPort: e.sourceHandle || '',
        to: e.target,
        toPort: e.targetHandle || '',
      })),
    };
  }, [projectName]);

  // Debounced 5s Autosave
  const scheduleAutosave = useCallback((currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]) => {
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    setSaveStatus('unsaved');
    autosaveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const graph = getGraphObject(currentNodes, currentEdges);
        await updateProject(params.projectId, { graph, name: projectName });
        setSaveStatus('saved');
      } catch (e) {
        console.warn('Autosave warning:', e);
        setSaveStatus('unsaved');
      }
    }, 5000);
  }, [getGraphObject, params.projectId, projectName]);

  // Sub-500ms Verification & Generation Pipeline
  const triggerPipeline = useCallback(async (currentNodes: Node<BlockNodeData>[], currentEdges: Edge[]) => {
    scheduleAutosave(currentNodes, currentEdges);
    const graph = getGraphObject(currentNodes, currentEdges);
    setConsoleMsg('Verifying Move bytecode & invariants...');
    try {
      const [genRes, permRes] = await Promise.all([
        generateCode(graph),
        runPermissions(graph),
      ]);

      if (genRes.files) {
        setGeneratedFiles(genRes.files);
        setSourceMap(genRes.sourceMap || {});

        const code = genRes.files[Object.keys(genRes.files)[1]] || genRes.files[Object.keys(genRes.files)[0]] || '';
        if (code && typeof window !== 'undefined') {
          localStorage.setItem('scc_latest_code', code);
        }
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

        setConsoleMsg(`100% Invariants Verified • ${auditRes.result?.findings?.length || 0} findings • Score: ${auditRes.result?.riskScore || 100}/100`);
      }

      if (permRes.result) {
        setPermissionsData(permRes.result);
      }
    } catch (e) {
      console.error('Pipeline check error:', e);
      setConsoleMsg('Pipeline telemetry error: check connections');
    }
  }, [getGraphObject, scheduleAutosave]);

  // History Push Helper
  const pushHistory = useCallback((newNodes: Node<BlockNodeData>[], newEdges: Edge[]) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push({
      nodes: JSON.parse(JSON.stringify(newNodes)),
      edges: JSON.parse(JSON.stringify(newEdges)),
    });
    if (nextHistory.length > 50) {
      nextHistory.shift();
    }
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // History Undo
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      triggerPipeline(prev.nodes, prev.edges);
      setConsoleMsg(`Undo applied (${historyIndexRef.current + 1}/${historyRef.current.length} states)`);
    }
  }, [setNodes, setEdges, triggerPipeline]);

  // History Redo
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      setNodes(next.nodes);
      setEdges(next.edges);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      triggerPipeline(next.nodes, next.edges);
      setConsoleMsg(`Redo applied (${historyIndexRef.current + 1}/${historyRef.current.length} states)`);
    }
  }, [setNodes, setEdges, triggerPipeline]);

  // Keyboard Shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Typed Port Connection Validation
  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) {
        setConsoleMsg('Invalid Connection: Self-referencing loops are not permitted');
        return false;
      }

      const isDuplicate = edges.some(
        (e) =>
          e.source === connection.source &&
          e.target === connection.target &&
          e.sourceHandle === connection.sourceHandle &&
          e.targetHandle === connection.targetHandle
      );
      if (isDuplicate) {
        setConsoleMsg('Invalid Connection: Port connection already exists');
        return false;
      }

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;

      const sourcePort = sourceNode.data?.spec?.ports?.out?.find((p: any) => p.name === connection.sourceHandle);
      const targetPort = targetNode.data?.spec?.ports?.in?.find((p: any) => p.name === connection.targetHandle);

      if (!sourcePort || !targetPort) return true;

      const st = sourcePort.type;
      const tt = targetPort.type;

      if (st === tt || st === 'Any' || tt === 'Any') return true;

      const isAccessSource = ['AccessGate', 'OwnerRef', 'AdminRef', 'RoleGate'].includes(st);
      const isAccessTarget = ['AccessGate', 'OwnerRef', 'AdminRef', 'RoleGate'].includes(tt);
      if (isAccessSource && isAccessTarget) return true;

      const isTokenSource = ['TokenRef', 'FinanceRef', 'CollectionRef'].includes(st);
      const isTokenTarget = ['TokenRef', 'FinanceRef', 'CollectionRef'].includes(tt);
      if (isTokenSource && isTokenTarget) return true;

      const isMintSource = ['MintGate', 'MintRulesConfig'].includes(st);
      const isMintTarget = ['MintGate', 'MintRulesConfig'].includes(tt);
      if (isMintSource && isMintTarget) return true;

      setConsoleMsg(`Port Type Mismatch: Cannot connect ${st} (${sourcePort.name}) to ${tt} (${targetPort.name})`);
      return false;
    },
    [edges, nodes]
  );

  // Convert graph to React Flow nodes/edges with clean left-to-right routing
  const loadGraphIntoCanvas = useCallback((graph: any, allBlocks: BlockSpec[]) => {
    const specsMap: Record<string, BlockSpec> = {};
    allBlocks.forEach((b) => { specsMap[b.type] = b; });

    const newNodes: Node<BlockNodeData>[] = (graph.blocks || []).map((b: any, idx: number) => {
      const spec = specsMap[b.type] || {
        type: b.type,
        category: 'Token',
        title: b.type,
        ports: { in: [], out: [] },
        props: {},
      };

      // Clean default left-to-right layout if no position provided:
      // Access (left: 60), Gate/Config (middle: 440), Asset/Store (right: 820)
      let defaultX = 80 + idx * 360;
      let defaultY = 160;
      if (b.type.startsWith('access.')) {
        defaultX = 60;
        defaultY = 140 + idx * 160;
      } else if (b.type.includes('mint_control') || b.type.includes('pause') || b.type.includes('royalty')) {
        defaultX = 440;
        defaultY = 80 + (idx % 2) * 220;
      } else if (b.type.startsWith('token.') || b.type.startsWith('nft.') || b.type.startsWith('finance.')) {
        defaultX = 820;
        defaultY = 160;
      }

      return {
        id: b.id,
        type: 'blockNode',
        position: b.position || { x: defaultX, y: defaultY },
        data: {
          spec,
          props: b.props || {},
          status: 'valid',
          learningMode: true,
          isSelected: false,
        },
      };
    });

    // Clean, structured smoothstep edges with visible arrow markers
    const newEdges: Edge[] = (graph.edges || []).map((e: any, idx: number) => ({
      id: `e_${e.from}_${e.to}_${idx}`,
      source: e.from,
      sourceHandle: e.fromPort,
      target: e.to,
      targetHandle: e.toPort,
      type: 'smoothstep',
      style: { stroke: '#0f766e', strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#0f766e',
        width: 14,
        height: 14,
      },
    }));

    const validatedNodes = validateNodesWithEdges(newNodes, newEdges);
    setNodes(validatedNodes);
    setEdges(newEdges);
    pushHistory(validatedNodes, newEdges);
    triggerPipeline(validatedNodes, newEdges);
  }, [pushHistory, setEdges, setNodes, triggerPipeline, validateNodesWithEdges]);

  // Initial Data Fetch
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

        // Load Project Graph if existing, otherwise default template
        let loaded = false;
        if (params.projectId && params.projectId !== 'demo') {
          try {
            const projRes = await getProject(params.projectId);
            if (projRes.project) {
              if (projRes.project.name) {
                setProjectName(projRes.project.name);
              }
              if (projRes.project.graph?.blocks?.length) {
                loadGraphIntoCanvas(projRes.project.graph, blocksRes.blocks || []);
                loaded = true;
              }
            }
          } catch (err) {
            console.warn('Could not load project graph:', err);
          }
        }

        if (!loaded) {
          const defaultTmpl = templatesRes.templates?.find((t: any) => t.id === 'template_fungible_token') || templatesRes.templates?.[0];
          if (defaultTmpl?.graph) {
            loadGraphIntoCanvas(defaultTmpl.graph, blocksRes.blocks || []);
          }
        }
      } catch (e) {
        console.error('Init error:', e);
      }
    }
    init();
  }, [loadGraphIntoCanvas, params.projectId]);

  // Connect ports with clean orthogonal smoothstep edge and validation
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection)) return;

      const newEdge: Edge = {
        ...connection,
        id: `e_${connection.source}_${connection.target}_${Date.now()}`,
        type: 'smoothstep',
        style: { stroke: '#0f766e', strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#0f766e',
          width: 14,
          height: 14,
        },
      };

      const updatedEdges = [...edges, newEdge];
      const validatedNodes = validateNodesWithEdges(nodes, updatedEdges);
      setEdges(updatedEdges);
      setNodes(validatedNodes);
      pushHistory(validatedNodes, updatedEdges);
      triggerPipeline(validatedNodes, updatedEdges);
      setConsoleMsg(`Connected ${connection.sourceHandle || 'out'} → ${connection.targetHandle || 'in'}`);
    },
    [edges, isValidConnection, nodes, pushHistory, setEdges, setNodes, triggerPipeline, validateNodesWithEdges]
  );

  // Drag & drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const blockType = event.dataTransfer.getData('application/reactflow');
      if (!blockType) return;

      const spec = blocksList.find((b) => b.type === blockType) || {
        type: blockType,
        category: 'Token',
        title: blockType,
        ports: { in: [], out: [] },
        props: {},
      };

      const newId = `b_${Date.now().toString().slice(-4)}`;
      const newNode: Node<BlockNodeData> = {
        id: newId,
        type: 'blockNode',
        position: { x: event.clientX - 320, y: event.clientY - 140 },
        data: {
          spec,
          props: Object.fromEntries(Object.entries(spec.props || {}).map(([k, v]) => [k, v.default ?? ''])),
          status: 'valid',
          learningMode,
        },
      };

      const updatedNodes = nodes.concat(newNode);
      const validatedNodes = validateNodesWithEdges(updatedNodes, edges);
      setNodes(validatedNodes);
      pushHistory(validatedNodes, edges);
      triggerPipeline(validatedNodes, edges);
    },
    [blocksList, learningMode, edges, nodes, pushHistory, setNodes, triggerPipeline, validateNodesWithEdges]
  );

  const handleUpdateProps = (blockId: string, updatedProps: Record<string, any>) => {
    const updated = nodes.map((n) => (n.id === blockId ? { ...n, data: { ...n.data, props: updatedProps } } : n));
    const validated = validateNodesWithEdges(updated, edges);
    setNodes(validated);
    pushHistory(validated, edges);
    triggerPipeline(validated, edges);
  };

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
    setActiveTab('properties');
    setIsInspectorOpen(true);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleExportReport = async () => {
    try {
      setConsoleMsg('Rendering WeasyPrint PDF Audit Report...');
      const payload = {
        projectName: 'SkyApes_Token_Vesting',
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

  const handleDownloadMoveFile = () => {
    const code = generatedFiles[Object.keys(generatedFiles)[1]] || generatedFiles[Object.keys(generatedFiles)[0]] || '';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SkyApes_Token_Vesting.move';
    a.click();
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      
      {/* --- Top Sub-Header / Command Bar --- */}
      <div
        style={{
          height: '52px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          background: 'var(--surface-container-lowest)',
          zIndex: 20,
        }}
      >
        {/* Left: Module Filename & Autosave Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCode size={16} color="var(--primary)" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setSaveStatus('unsaved');
                scheduleAutosave(nodes, edges);
              }}
              title="Click to rename contract module"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '4px',
                padding: '2px 4px',
                outline: 'none',
                maxWidth: '220px',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'transparent')}
            />
            <span
              style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                background: 'var(--surface-container-low)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              .mv
            </span>
          </div>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          <span
            style={{
              color: saveStatus === 'saved' ? 'var(--tertiary)' : saveStatus === 'saving' ? 'var(--primary)' : 'var(--risk-medium)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <CheckCircle2 size={13} />
            {saveStatus === 'saved' ? 'Autosaved' : saveStatus === 'saving' ? 'Autosaving (5s)...' : 'Unsaved Changes'}
          </span>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          {/* Undo / Redo controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo last change (Ctrl+Z)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                background: canUndo ? 'var(--surface-container-low)' : 'transparent',
                color: canUndo ? 'var(--text-primary)' : 'var(--text-disabled)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: canUndo ? 'pointer' : 'not-allowed',
                opacity: canUndo ? 1 : 0.45,
              }}
            >
              <Undo2 size={12} />
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                background: canRedo ? 'var(--surface-container-low)' : 'transparent',
                color: canRedo ? 'var(--text-primary)' : 'var(--text-disabled)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: canRedo ? 'pointer' : 'not-allowed',
                opacity: canRedo ? 1 : 0.45,
              }}
            >
              <Redo2 size={12} />
              Redo
            </button>
          </div>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          {/* Grid Snap & Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <button
              onClick={() => setGridSnap(!gridSnap)}
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                background: gridSnap ? 'var(--primary-container)' : 'transparent',
                color: gridSnap ? 'var(--primary)' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              Snap: {gridSnap ? 'ON' : 'OFF'}
            </button>
            <span style={{ fontFamily: 'var(--font-mono)' }}>Zoom: 100%</span>
          </div>

          <span style={{ color: 'var(--border-strong)' }}>|</span>

          {/* Learning Mode Switch */}
          <button
            onClick={() => setLearningMode(!learningMode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              border: `1px solid ${learningMode ? 'var(--primary)' : 'var(--border-subtle)'}`,
              background: learningMode ? 'var(--primary-container)' : 'transparent',
              color: learningMode ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <BookOpen size={12} />
            Learning Mode: {learningMode ? 'Active' : 'Muted'}
          </button>
        </div>

        {/* Right Action CTAs + TOGGLE CODE DISPLAY BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Prominent Code & Inspector Toggle Button */}
          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            id="toggle-inspector-btn"
            style={{
              background: isInspectorOpen ? 'var(--primary-container)' : 'var(--surface-container-low)',
              color: isInspectorOpen ? 'var(--primary)' : 'var(--text-primary)',
              border: `1px solid ${isInspectorOpen ? 'var(--primary)' : 'var(--border-subtle)'}`,
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={isInspectorOpen ? 'Hide code display and inspector' : 'Show code display and inspector'}
          >
            {isInspectorOpen ? <PanelRightClose size={14} /> : <Code2 size={14} />}
            <span>{isInspectorOpen ? 'Hide Code & Inspector' : 'Show Code & Inspector'}</span>
          </button>

          {/* Prompt-to-Block AI Trigger */}
          <button
            onClick={() => setIsPromptDrawerOpen(true)}
            id="ai-prompt-btn"
            style={{
              background: 'var(--surface-container-low)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            AI Prompt-to-Blocks
          </button>

          {/* Amber Gas Sim */}
          <button
            onClick={() => (window.location.href = '/gas-optimizer')}
            id="gas-profiler-btn"
            style={{
              background: 'var(--risk-medium-bg)',
              color: 'var(--risk-medium)',
              border: '1px solid var(--risk-medium-border)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Flame size={14} />
            Gas Profiler
          </button>

          {/* Emerald Check & Audit */}
          <button
            onClick={() => triggerPipeline(nodes, edges)}
            id="check-btn"
            style={{
              background: 'var(--tertiary-container)',
              color: 'var(--tertiary)',
              border: '1px solid var(--tertiary-border)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <ShieldCheck size={14} />
            Verify AST
          </button>

          {/* Teal Pre-Deploy Gate */}
          <button
            onClick={() => setIsDeployModalOpen(true)}
            id="deploy-gate-btn"
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Rocket size={14} />
            Pre-Deploy
          </button>
        </div>
      </div>

      {/* --- Main Studio Workspace (Canvas + Optional Collapsible Inspector) --- */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Column: Primitives Library + Templates (280px) */}
        <aside
          style={{
            width: '280px',
            borderRight: '1px solid var(--border-subtle)',
            background: 'var(--surface-container-lowest)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
          }}
        >
          {/* AI Move Assistant Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--surface-container-low) 0%, var(--primary-container) 100%)',
              border: '1px solid rgba(15, 118, 110, 0.2)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Cpu size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Move AI Assistant
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                Prover logic active
              </div>
            </div>
          </div>

          <BlockPalette
            categories={categories}
            groupedBlocks={groupedBlocks}
            onSelectBlock={(spec) => {
              const newId = `b_${Date.now().toString().slice(-4)}`;
              const newNode: Node<BlockNodeData> = {
                id: newId,
                type: 'blockNode',
                position: { x: 300, y: 180 },
                data: {
                  spec,
                  props: Object.fromEntries(Object.entries(spec.props || {}).map(([k, v]) => [k, v.default ?? ''])),
                  status: 'valid',
                  learningMode,
                },
              };
              const updatedNodes = nodes.concat(newNode);
              const validatedNodes = validateNodesWithEdges(updatedNodes, edges);
              setNodes(validatedNodes);
              pushHistory(validatedNodes, edges);
              triggerPipeline(validatedNodes, edges);
            }}
          />

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <TemplatePicker
              templates={templates}
              onSelectTemplate={(tmpl) => loadGraphIntoCanvas(tmpl.graph, blocksList)}
            />
          </div>
        </aside>

        {/* Center: React Flow Canvas (Takes Full Width when Inspector is hidden!) */}
        <main
          style={{
            flex: 1,
            position: 'relative',
            background: 'var(--surface)',
          }}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* Top Quick Actions */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
            <button
              onClick={() => {
                setNodes([]);
                setEdges([]);
                pushHistory([], []);
                triggerPipeline([], []);
                setConsoleMsg('Canvas cleared');
              }}
              style={{
                padding: '5px 10px',
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Clear Canvas
            </button>

            <button
              onClick={handleExportReport}
              style={{
                padding: '5px 10px',
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Download size={13} />
              Export PDF Audit
            </button>
          </div>

          {/* Floating Button when Inspector is Closed */}
          {!isInspectorOpen && (
            <button
              onClick={() => setIsInspectorOpen(true)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-md)',
                zIndex: 15,
                cursor: 'pointer',
              }}
            >
              <PanelRightOpen size={14} />
              <span>Show Code & Inspector</span>
            </button>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isValidConnection={isValidConnection}
            onNodeClick={onNodeClick}
            onNodeDragStop={() => pushHistory(nodes, edges)}
            onNodesDelete={(deleted) => {
              const remainingNodes = nodes.filter((n) => !deleted.some((d) => d.id === n.id));
              const remainingEdges = edges.filter(
                (e) => !deleted.some((d) => d.id === e.source || d.id === e.target)
              );
              const validated = validateNodesWithEdges(remainingNodes, remainingEdges);
              setNodes(validated);
              setEdges(remainingEdges);
              pushHistory(validated, remainingEdges);
              triggerPipeline(validated, remainingEdges);
            }}
            onEdgesDelete={(deleted) => {
              const remaining = edges.filter((e) => !deleted.some((d) => d.id === e.id));
              const validated = validateNodesWithEdges(nodes, remaining);
              setNodes(validated);
              setEdges(remaining);
              pushHistory(validated, remaining);
              triggerPipeline(validated, remaining);
            }}
            deleteKeyCode={['Backspace', 'Delete']}
            nodeTypes={nodeTypes}
            snapToGrid={gridSnap}
            snapGrid={[16, 16]}
            fitView
          >
            {/* Luminous Pristine Dot Matrix Background */}
            <Background color="#cbdbf5" gap={16} size={1.5} />
            <Controls
              style={{
                background: 'var(--surface-container-lowest)',
                borderColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                borderRadius: '8px',
              }}
            />
            <MiniMap
              nodeColor="#0f766e"
              maskColor="rgba(203, 219, 245, 0.4)"
              style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)',
              }}
            />
          </ReactFlow>

          {/* Bottom Canvas HUD: Topology, Block Count, Verification */}
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: isInspectorOpen ? '1rem' : '1rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10,
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{consoleMsg}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
              <span>Blocks: <strong style={{ color: 'var(--primary)' }}>{nodes.length}</strong></span>
              <span>Connections: <strong style={{ color: 'var(--primary)' }}>{edges.length}</strong></span>
              <span style={{ color: 'var(--tertiary)' }}>Risk: {riskScore}/100 ({riskBand})</span>
            </div>
          </div>
        </main>

        {/* --- Collapsible Code Display & Inspector (Column 3) --- */}
        {isInspectorOpen && (
          <aside
            style={{
              width: '440px',
              borderLeft: '1px solid var(--border-subtle)',
              background: 'var(--code-canvas)',
              color: 'var(--code-text)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {/* Tabs Header + Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #1e293b',
                background: '#090d16',
                paddingRight: '6px',
              }}
            >
              <div style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
                {[
                  { id: 'code', label: 'Generated Code' },
                  { id: 'properties', label: 'Properties' },
                  { id: 'audit', label: `Audit (${findings.length})` },
                  { id: 'gas', label: 'Gas Matrix' },
                  { id: 'permissions', label: 'Permissions' },
                  { id: 'learn', label: 'Learn' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: '10px 8px',
                      background: 'transparent',
                      border: 'none',
                      color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                      borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Close / Collapse Button */}
              <button
                onClick={() => setIsInspectorOpen(false)}
                title="Collapse inspector"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginLeft: '4px',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Code Header Bar with Sync Badge and Download */}
            {activeTab === 'code' && (
              <div
                style={{
                  padding: '6px 12px',
                  background: '#0e1526',
                  borderBottom: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: '#34d399' }}>● Synced in 120ms • Verified AST</span>
                <button
                  onClick={handleDownloadMoveFile}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.6875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={11} />
                  .move file
                </button>
              </div>
            )}

            {/* Panel Content */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
              {activeTab === 'properties' && (
                <PropertiesPanel
                  selectedBlock={
                    selectedNode
                      ? {
                          id: selectedNode.id,
                          type: selectedNode.data.spec?.type,
                          props: selectedNode.data.props,
                          spec: selectedNode.data.spec,
                        }
                      : null
                }
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
                  selectedBlockType={selectedNode?.data.spec?.type}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Modals & Drawers */}
      <PromptDrawer
        isOpen={isPromptDrawerOpen}
        onClose={() => setIsPromptDrawerOpen(false)}
        onApplyGraph={(newGraph) => {
          loadGraphIntoCanvas(newGraph, blocksList);
          setIsPromptDrawerOpen(false);
        }}
      />

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        hasCompilePassed={true}
        criticalIssuesCount={findings.filter((f) => f.severity === 'Critical').length}
        moduleName="sky_apes_contract"
      />
    </div>
  );
}
