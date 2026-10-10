export interface GasFunctionEntry {
  function: string;
  measured: boolean;
  gasUnits?: number;
  gasPrice?: number;
  approximateApt?: number;
  note?: string;
}

export interface GasOptimizationPatch {
  id: string;
  pattern: string;
  title: string;
  diff: string;
  beforeGas: number;
  afterGas: number;
  savedPct: number;
  verified: boolean;
}

export interface GasReportData {
  entries: GasFunctionEntry[];
  totalGasEstimate?: number;
  totalAptEstimate?: number;
  optimizations: GasOptimizationPatch[];
}
