
export interface Ivertice {
  alias?: string;
  task: {
    value: string;
  };
  vertexId?: number;
  vertexX?: number;
  vertexY?: number;
  dependant?: string;
  comment?: string;
}


export interface WorkflowResult {
  workflowItems: WorkflowNode[];
  parmItems: ParmItem[]
  count: number;
  ok: boolean;
}

export type WorkflowNode = {
  name: string;
  type: string;
  summary?: string;
  version?: number;
  command?: string;
  commandOrScript?: string;
  opswiseGroups?: string[];
  remoteServer?: string;
  localFilename?: string;
  remoteFilename?: string;
  agent?: string;
  credentials?: string;
  runAsSudo?: boolean,
  resolveNameImmediately?: boolean;
  timeZonePref?: string;
  resPriority?: number;
  startHeld?: boolean;
  exclusiveWithSelf?: boolean;
  agentCluster?: string;
  comment?: string;

  workflowVertices?: Ivertice[];
  [key: string]: unknown;
};

export type ParmItem = { task: string; parameter: string };

export type TreeNode =
  {
    id: number;
    name: string;
    type: string;
    isVisible: boolean;
    comment: string;
    workflow: TreeNode[];
  }

export interface INumberDictionary {
  [key: string]: number;
}

export interface IStringDictionary {
  [key: string]: Set<string>;
}

export type Environment = {
  [key: string]: {
    prefix: string;
    credentials: string;
    business_area: [string];
    agent: string;
    uachost: string;
    uacport: string;
    token: string;
    planDir: string;
    backgroundcolor: string
  };
}

export type Config = {
  default: string;
  verticeStart: number;
  verticeStepX: number;
  verticeStepY: number;
  windowSize: number;
  dataDir: string;
  planBaseDir: string;
  environments: Environment;
  paramTimeout: number;
  localConfig: string;
  editor: string;
}

export interface IuserConfig {
  token: {
    prod: string,
    test: string
  },
  uacenv: string
}

export type ThrowEventType = {
  message: string;
  detail: string;
}
