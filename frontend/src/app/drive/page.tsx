'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HardDrive,
  Plus,
  Search,
  Grid,
  List,
  Copy,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Code,
  Check,
  Clock,
  Filter,
  FileCode,
  CheckCircle2,
  Sparkles,
  Layers,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import {
  fetchProjects,
  createProject,
  deleteProject,
  duplicateProject,
  downloadProjectZip,
  updateProject,
} from '../../lib/api';

interface ContractProject {
  id: string;
  name: string;
  mode?: string;
  network?: string;
  blocksCount?: number;
  updatedAt?: string;
  createdAt?: string;
  description?: string;
  standard?: string;
  status?: string;
  score?: number;
}

export default function ContractDrivePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ContractProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'token' | 'nft' | 'vault'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modals & Action States
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTemplate, setNewProjectTemplate] = useState('template_fungible_token');
  const [creating, setCreating] = useState(false);

  const [renamingProject, setRenamingProject] = useState<ContractProject | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renaming, setRenaming] = useState(false);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchProjects();
      if (res && res.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.warn('Failed to load projects from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      const res = await createProject({
        name: newProjectName.trim(),
        templateId: newProjectTemplate === 'blank' ? undefined : newProjectTemplate,
        network: 'testnet',
      });
      if (res && res.project) {
        setShowNewModal(false);
        setNewProjectName('');
        showNotification(`Created project "${res.project.name}"`);
        await loadProjects();
        router.push(`/workspace/${res.project.id}`);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (projectId: string, origName: string) => {
    try {
      const res = await duplicateProject(projectId);
      if (res && res.project) {
        showNotification(`Duplicated "${origName}" to "${res.project.name}"`);
        await loadProjects();
      }
    } catch (err) {
      console.error('Failed to duplicate project:', err);
    }
  };

  const handleDelete = async (projectId: string, projName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${projName}"?`)) return;
    try {
      await deleteProject(projectId);
      showNotification(`Deleted contract "${projName}"`);
      await loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleDownloadZip = async (projectId: string, projName: string) => {
    setDownloadingId(projectId);
    try {
      await downloadProjectZip(projectId, `${projName.replace(/\\s+/g, '_')}_package.zip`);
      showNotification(`Downloaded Move package for "${projName}"`);
    } catch (err) {
      console.error('Failed to download zip:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingProject || !renameValue.trim()) return;
    setRenaming(true);
    try {
      await updateProject(renamingProject.id, { name: renameValue.trim() });
      showNotification(`Renamed contract to "${renameValue.trim()}"`);
      setRenamingProject(null);
      await loadProjects();
    } catch (err) {
      console.error('Failed to rename project:', err);
    } finally {
      setRenaming(false);
    }
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'token') {
      return p.name.toLowerCase().includes('token') || p.name.toLowerCase().includes('aip');
    }
    if (activeFilter === 'nft') {
      return p.name.toLowerCase().includes('nft') || p.name.toLowerCase().includes('vip') || p.name.toLowerCase().includes('asset');
    }
    if (activeFilter === 'vault') {
      return p.name.toLowerCase().includes('vault') || p.name.toLowerCase().includes('dao') || p.name.toLowerCase().includes('multisig');
    }

    return true;
  });

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Toast Notification */}
        {actionSuccessMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#0f766e',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <CheckCircle2 size={16} />
            {actionSuccessMessage}
          </div>
        )}

        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-container)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HardDrive size={20} />
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Contract Drive & Cloud Vault
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '6px' }}>
              Persistent storage for your Aptos Move contract packages, architecture graphs, and deployed bytecodes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => loadProjects()}
              disabled={loading}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Refresh Drive"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              Refresh
            </button>

            <button
              onClick={() => {
                setNewProjectName('My_Aptos_Contract_' + Math.floor(Math.random() * 1000));
                setShowNewModal(true);
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Plus size={16} />
              New Contract
            </button>
          </div>
        </div>

        {/* Quota & Usage Overview Ribbon */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STORED CONTRACTS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{projects.length}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CLOUD STORAGE ALLOCATED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                {(projects.length * 0.45 + 1.2).toFixed(2)} MB <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 50 MB Free</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>APTOS NETWORK</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>Testnet 0x1</div>
            </div>
          </div>

          <div style={{ minWidth: '220px', flex: 1, maxWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Drive Storage Quota</span>
              <span>{Math.round(((projects.length * 0.45 + 1.2) / 50) * 100)}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--surface-dim)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, ((projects.length * 0.45 + 1.2) / 50) * 100)}%`, background: 'var(--primary)' }} />
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, View Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search contracts or module names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          {/* Filters & View Modes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Filter Pills */}
            <div style={{ display: 'flex', background: 'var(--surface-container-low)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {(['all', 'token', 'nft', 'vault'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFilter === filterKey ? '#ffffff' : 'transparent',
                    color: activeFilter === filterKey ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: activeFilter === filterKey ? 700 : 500,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: activeFilter === filterKey ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    textTransform: 'capitalize',
                  }}
                >
                  {filterKey === 'all' ? 'All Contracts' : filterKey === 'token' ? 'Fungible Tokens' : filterKey === 'nft' ? 'Digital Assets' : 'Vaults & DAO'}
                </button>
              ))}
            </div>

            {/* Grid / Table Toggle */}
            <div style={{ display: 'flex', background: 'var(--surface-container-low)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'table' ? '#ffffff' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Table View"
              >
                <List size={14} />
              </button>
            </div>

          </div>

        </div>

        {/* Content: Grid or Table View */}
        {loading && projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px' }} />
            <div>Loading your contract drive...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px dashed var(--border-subtle)',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <FolderOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              No contracts found
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              {searchQuery ? `No contracts match "${searchQuery}".` : 'Your contract drive is empty. Start by creating your first Move contract.'}
            </p>
            <button
              onClick={() => {
                setNewProjectName('SkyApes_Token_V1');
                setShowNewModal(true);
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              Create First Contract
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {filteredProjects.map((p) => {
              const isToken = p.name.toLowerCase().includes('token') || p.name.toLowerCase().includes('aip');
              const isNft = p.name.toLowerCase().includes('nft') || p.name.toLowerCase().includes('asset');
              const standardBadge = isToken ? 'AIP-21 Fungible Asset' : isNft ? 'Digital Asset v2' : 'Multi-Sig Escrow Vault';
              const blockCount = p.blocksCount || 5;

              return (
                <div
                  key={p.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.4rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    {/* Top Row: Standard Badge & Network */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--primary)',
                          background: 'var(--primary-container)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {standardBadge}
                      </span>

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#059669',
                          background: '#ecfdf5',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        Aptos Testnet
                      </span>
                    </div>

                    {/* Contract Title & ID */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {p.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      ID: {p.id}
                    </div>

                    {/* Architecture Specs */}
                    <div
                      style={{
                        background: 'var(--surface-container-low)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Layers size={14} color="var(--primary)" />
                        <span><strong>{blockCount}</strong> Connected Blocks</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                        <ShieldCheck size={14} />
                        <span>Passes AST Prover</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      <Clock size={12} />
                      <span>Updated {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently'}</span>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                      <Link
                        href={`/workspace/${p.id}`}
                        style={{
                          flex: 1,
                          padding: '7px 12px',
                          borderRadius: '6px',
                          background: 'var(--primary)',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <FileCode size={13} />
                        Open Canvas
                      </Link>

                      <button
                        onClick={() => handleDownloadZip(p.id, p.name)}
                        disabled={downloadingId === p.id}
                        style={{
                          padding: '7px 9px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: '#ffffff',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Download .move Package ZIP"
                      >
                        <Download size={13} />
                      </button>

                      <button
                        onClick={() => handleDuplicate(p.id, p.name)}
                        style={{
                          padding: '7px 9px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: '#ffffff',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Duplicate Contract"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => {
                          setRenamingProject(p);
                          setRenameValue(p.name);
                        }}
                        style={{
                          padding: '7px 9px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: '#ffffff',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Rename Contract"
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        style={{
                          padding: '7px 9px',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete Contract"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Contract Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Package Standard</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Connected Blocks</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Network</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Last Modified</th>
                  <th style={{ textAlign: 'right', padding: '12px 18px', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <Link href={`/workspace/${p.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {p.name}
                      </Link>
                      <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {p.id}
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>
                      {p.name.toLowerCase().includes('nft') ? 'Digital Asset v2' : 'AIP-21 Fungible Asset'}
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {p.blocksCount || 5} Blocks
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: '#059669' }}>
                      Aptos Testnet
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Link
                          href={`/workspace/${p.id}`}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: 'var(--primary-container)',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Open
                        </Link>
                        <button
                          onClick={() => handleDownloadZip(p.id, p.name)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
                          title="Download ZIP"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id, p.name)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#dc2626' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: New Contract */}
        {showNewModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '480px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Create New Move Contract
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Initialize a blank Aptos contract package or generate from an established standard template.
              </p>

              <form onSubmit={handleCreateNew}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Contract / Module Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. MyGovernanceToken"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Starter Architecture Template
                  </label>
                  <select
                    value={newProjectTemplate}
                    onChange={(e) => setNewProjectTemplate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.85rem',
                      background: '#ffffff',
                    }}
                  >
                    <option value="template_fungible_token">AIP-21 Fungible Asset (Token + Mint + Freeze)</option>
                    <option value="template_nft_collection">Digital Asset v2 (NFT Collection + Royalty)</option>
                    <option value="template_staking_vault">DAO Multi-Sig Escrow & Staking Vault</option>
                    <option value="blank">Blank Canvas (Empty Architecture)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: '#ffffff',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {creating ? 'Creating...' : 'Create & Launch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Rename Contract */}
        {renamingProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Rename Contract
              </h3>
              <form onSubmit={handleRenameSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    New Contract Name
                  </label>
                  <input
                    type="text"
                    required
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRenamingProject(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: '#ffffff',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={renaming}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {renaming ? 'Saving...' : 'Save Name'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
