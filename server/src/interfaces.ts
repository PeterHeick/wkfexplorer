
export interface Ivertice {
  alias?: string;
  task?: {
    value: string;
  };
  vertexId?: string;
  vertexX?: string;
  vertexY?: string;
}

export type WorkflowNode =  {
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

  workflowVertices?: Ivertice[];
  [key: string]: unknown;
} ;

export type TreeNode = 
{
  id: number;
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
  
  isVisible: boolean;
  color: string;
  workflow: TreeNode[];
}

export const emptyWorkflowNode: WorkflowNode = {
  name: "",
  type: "",
  summary: "",
  command: "",
  commandOrScript: "",
  opswiseGroups: [],
  remoteServer: "",
  localFilename: "",
  remoteFilename: "",
  agent: "",
  credentials: "",
  runAsSudo: false,
  resolveNameImmediately: false,
  timeZonePref: "",
  resPriority: 0,
  startHeld: false,
  exclusiveWithSelf: false,
  agentCluster: "",

  workflowVertices: [],
}

export interface INumberDictionary {
  [key: string]: number;
}

export interface Iconfig {
  [ key: string ]: {
    prefix: string;
    credentials: string;
    business_area: [ string ];
    agent: string;
    uachost: string;
    uacport: string;
    jcl: string;
    token: 'prod' | 'test';
  };
}

export interface IuserConfig {
  token: {
    prod: string,
    test: string
  },
  uacenv: string
}

export interface RootState {} 

export interface State {
  configData: Iconfig[]
}

export interface Idata {
  uac: WorkflowNode[];
  globalUacConfig: Iconfig;
  userUacConfig: IuserConfig;
  uacenv: string;
}


interface TaskUnix {
  type: string;
  actions: {
    abortActions: any[];
    emailNotifications: any[];
    setVariableActions: any[];
    snmpNotifications: any[];
    systemOperations: any[];
  };
  agent: string;
  agentCluster: null;
  agentClusterVar: null;
  agentVar: null;
  broadcastCluster: null;
  broadcastClusterVar: null;
  command: string;
  commandOrScript: string;
  cpDuration: null;
  cpDurationUnit: string;
  credentials: string;
  credentialsVar: null;
  customField1: {
    label: null;
    value: null;
  };
  customField2: {
    label: null;
    value: null;
  };
  efDayConstraint: string;
  efDuration: string;
  efEnabled: boolean;
  efNthAmount: number;
  efOffsetDuration: null;
  efOffsetDurationUnit: string;
  efOffsetPercentage: number;
  efOffsetType: string;
  efTime: string;
  efType: string;
  environment: any[];
  exclusiveTasks: any[];
  exclusiveWithSelf: boolean;
  executionRestriction: string;
  exitCodeOutput: null;
  exitCodeProcessing: string;
  exitCodeText: null;
  exitCodes: string;
  exportReleaseLevel: string;
  exportTable: string;
  firstRun: string;
  holdResources: boolean;
  lastRun: string;
  lfDayConstraint: string;
  lfDuration: string;
  lfEnabled: boolean;
  lfNthAmount: number;
  lfOffsetDuration: null;
  lfOffsetDurationUnit: string;
  lfOffsetPercentage: number;
  lfOffsetType: string;
  lfTime: string;
  lfType: string;
  logLevel: string;
  lsDayConstraint: string;
  lsDuration: string;
  lsEnabled: boolean;
  lsNthAmount: number;
  lsTime: string;
  lsType: string;
  name: string;
  notes: {
    sysId: string;
    text: string;
    title: string;
  }[];
  opswiseGroups: string[];
  outputFailureOnly: boolean;
  outputReturnFile: null;
  outputReturnNline: null;
  outputReturnSline: null;
  outputReturnText: null;
  outputReturnType: string;
  outputType: string;
  parameters: string;
  resPriority: number;
  resolveNameImmediately: boolean;
  restrictionPeriod: string;
  restrictionPeriodAfterDate: null;
  restrictionPeriodAfterTime: null;
  restrictionPeriodBeforeDate: null;
  restrictionPeriodBeforeTime: null;
  restrictionPeriodDateList: any[];
  retainSysIds: boolean;
  retryExitCodes: null;
  retryIndefinitely: boolean;
  retryInterval: number;
  retryMaximum: number;
  retrySuppressFailure: boolean;
  runAsSudo: boolean;
  runCount: number;
  runTime: number;
  runtimeDir: null;
  script: null;
  startHeld: boolean;
  startHeldReason: null;
  summary: string;
  sysId: string;
  timeZonePref: string;
  twDelayAmount: null;
  twDelayDuration: string;
  twDelayType: string;
  twWaitAmount: null;
  twWaitDayConstraint: string;
  twWaitDuration: string;
  twWaitTime: string;
  twWaitType: string;
  twWorkflowOnly: string;
  userEstimatedDuration: null
  variables: any[];
  version: number;
  virtualResources: any[];
  waitForOutput: boolean;
}
