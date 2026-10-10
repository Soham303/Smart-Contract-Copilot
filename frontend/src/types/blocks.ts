export interface PortSpec {
  name: string;
  type: string;
  description?: string;
}

export interface PropSpec {
  type: 'string' | 'int' | 'boolean' | 'enum';
  default?: any;
  min?: number;
  max?: number;
  values?: string[];
  description?: string;
  required?: boolean;
}

export interface BlockSpec {
  type: string;
  category: 'Token' | 'NFT' | 'Finance' | 'Governance' | 'Access' | 'Logic';
  title: string;
  description?: string;
  ports: {
    in: PortSpec[];
    out: PortSpec[];
  };
  props: Record<string, PropSpec>;
  concepts?: string[];
  auditHints?: string[];
}
