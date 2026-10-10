export interface GraphMeta {
  name: string;
  moduleName: string;
  version?: string;
  author?: string;
}

export interface BlockNode {
  id: string;
  type: string;
  props: Record<string, any>;
  position?: { x: number; y: number };
}

export interface Edge {
  id?: string;
  from: string;
  fromPort: string;
  to: string;
  toPort: string;
}

export interface ContractGraph {
  schemaVersion: string;
  target: string;
  meta: GraphMeta;
  blocks: BlockNode[];
  edges: Edge[];
}
