'use client';

import React from 'react';

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  graph: any;
}

interface TemplatePickerProps {
  templates: TemplateItem[];
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  templates,
  onSelectTemplate,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        PRE-WIRED TEMPLATES
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => onSelectTemplate(tmpl)}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{tmpl.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {tmpl.category}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {tmpl.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
