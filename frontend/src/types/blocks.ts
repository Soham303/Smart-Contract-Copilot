export interface PortSpec {
  name: string;
  type: string;
}

export interface PropSpec {
  type: 'string' | 'int' | 'boolean' | 'enum';
  default?: any;
  min?: number;
  max?: number;
  values?: string[];
  description?: string;
}

export interface BlockSpec {
  type: string;
  category: 'Token' | 'NFT' | 'Finance' | 'Governance' | 'Access' | 'Logic';
  title: string;
  ports: {
    in: PortSpec[];
    out: PortSpec[];
  };
  props: Record<string, PropSpec>;
  concepts?: string[];
  auditHints?: string[];
}
