export type ActorType = 'Anyone' | 'Owner/Admin' | 'Specific Role' | 'Nobody/Disabled';

export interface PermissionRow {
  action: string;
  actor: ActorType;
  details?: string;
}

export interface KeyAnswers {
  whoCanMint: string;
  whoCanWithdraw: string;
  whoCanPause: string;
  canSupplyGrow: string;
  canContractBeUpgraded: string;
}

export interface PermissionsData {
  matrix: PermissionRow[];
  keyAnswers: KeyAnswers;
  mutableParameters: string[];
  fundsFlow: {
    inflow: string;
    outflow: string;
    controllers: string[];
  };
}
