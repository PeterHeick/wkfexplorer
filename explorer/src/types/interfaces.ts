
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
  isVisible: boolean;
  workflow: TreeNode[];
}

/*
export interface INumberDictionary {
  [key: string]: number;
}

export interface IStringDictionary {
  [key: string]: Set<string>;
}
*/

export type ConfigType = {
  default: string;
  environments: Environment;
}

export type Environment = {
  [key: string]: {
    pattern: string;
    credentials: string;
    business_area: [string];
    agent: string;
    uachost: string;
    uacport: string;
    token: string;
    backgroundcolor: string;
  };
}

export type Task = TaskUnix | TaskFtp | TaskEmail;
export type TaskUnix = {
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

export type TaskFtp = {
  type: string;
  actions: {
    abortActions: any[];
    emailNotifications: any[];
    setVariableActions: any[];
    snmpNotifications: any[];
    systemOperations: any[];
  };
  agent: string;
  agentCluster: string | null;
  agentClusterVar: null;
  agentVar: null;
  authenticatePeer: boolean;
  broadcastCluster: null;
  broadcastClusterVar: null;
  codepage: string;
  command: string;
  compress: string;
  cpDuration: null;
  cpDurationUnit: string;
  createop: string;
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
  encrypt: string;
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
  formOrScript: string;
  format: string;
  ftpSubcommands: null;
  holdResources: boolean;
  jobcard: null;
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
  localFilename: string;
  logLevel: string;
  lsDayConstraint: string;
  lsDuration: string;
  lsEnabled: boolean;
  lsNthAmount: number;
  lsTime: string;
  lsType: string;
  move: boolean;
  name: string;
  nft: boolean;
  notes: any[];
  opswiseGroups: string[];
  outputType: string;
  primaryBroker: null;
  primaryBrokerChoice: string;
  primaryBrokerRef: null;
  primaryCluster: null;
  primaryClusterRef: null;
  primaryCredVar: null;
  primaryCredentials: null;
  primaryFilesys: string;
  primaryOpenOptions: null;
  remoteCredVar: null;
  remoteCredentials: string;
  remoteFilename: string;
  remoteServer: string;
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
  runCount: number;
  runTime: number;
  runtimeDir: null;
  script: null;
  secondaryBroker: null;
  secondaryBrokerChoice: string;
  secondaryBrokerRef: null;
  secondaryCluster: null;
  secondaryClusterRef: null;
  secondaryCredVar: null;
  secondaryCredentials: null;
  secondaryFilesys: string;
  secondaryOpenOptions: any | null;
  serverType: string;
  showProgress: boolean;
  startHeld: boolean;
  startHeldReason: string | null;
  summary: string;
  sysId: string;
  timeZonePref: string;
  transferDirection: string;
  transferMode: string;
  trimSpace: boolean;
  twDelayAmount: number | null;
  twDelayDuration: string;
  twDelayType: string;
  twWaitAmount: number | null;
  twWaitDayConstraint: string;
  twWaitDuration: string;
  twWaitTime: string;
  twWaitType: string;
  twWorkflowOnly: string;
  udmOperation: string;
  udmOptions: any | null;
  useRegex: boolean;
  userEstimatedDuration: number | null;
  variables: any[];
  verifyHostName: boolean;
  version: number;
  virtualResources: any[];
}

export type TaskEmail = {
  type: string;
  actions: {
    abortActions: any[];
    emailNotifications: any[];
    setVariableActions: any[];
    snmpNotifications: any[];
    systemOperations: any[];
  };
  attachLocalFile: boolean;
  avgRunTime: number;
  avgRunTimeDisplay: string;
  bccRecipients: null | string;
  body: string;
  ccRecipients: null | string;
  connection: string;
  cpDuration: null | any;
  cpDurationUnit: string;
  customField1: {
    label: null | any;
    value: null | any;
  };
  customField2: {
    label: null | any;
    value: null | any;
  };
  efDayConstraint: string;
  efDuration: string;
  efEnabled: boolean;
  efNthAmount: number;
  efOffsetDuration: null | any;
  efOffsetDurationUnit: string;
  efOffsetPercentage: number;
  efOffsetType: string;
  efTime: string;
  efType: string;
  exclusiveTasks: any[];
  exclusiveWithSelf: boolean;
  executionRestriction: string;
  exportReleaseLevel: string;
  exportTable: string;
  firstRun: string;
  holdResources: boolean;
  lastRun: string;
  lastRunTime: number;
  lastRunTimeDisplay: string;
  lfDayConstraint: string;
  lfDuration: string;
  lfEnabled: boolean;
  lfNthAmount: number;
  lfOffsetDuration: null | any;
  lfOffsetDurationUnit: string;
  lfOffsetPercentage: number;
  lfOffsetType: string;
  lfTime: string;
  lfType: string;
  listReportFormat: string;
  logLevel: string;
  lsDayConstraint: string;
  lsDuration: string;
  lsEnabled: boolean;
  lsNthAmount: number;
  lsTime: string;
  lsType: string;
  maxRunTime: number;
  maxRunTimeDisplay: string;
  minRunTime: number;
  minRunTimeDisplay: string;
  name: string;
  notes: any[];
  opswiseGroups: string[];
  replyTo: string;
  report: null | any;
  reportVar: null | any;
  resPriority: number;
  resolveNameImmediately: boolean;
  restrictionPeriod: string;
  restrictionPeriodAfterDate: null | any;
  restrictionPeriodAfterTime: null | any;
  restrictionPeriodBeforeDate: null | any;
  restrictionPeriodBeforeTime: null | any;
  restrictionPeriodDateList: any[];
  retainSysIds: boolean;
  runCount: number;
  runTime: number;
  startHeld: boolean;
  startHeldReason: null | any;
  subject: string;
  summary: string;
  sysId: string;
  template: null | any;
  templateVar: null | any;
  timeZonePref: string;
  toRecipients: string;
  twDelayAmount: null | any;
  twDelayDuration: string;
  twDelayType: string;
  twWaitAmount: null | any;
  twWaitDayConstraint: string;
  twWaitDuration: string;
  twWaitTime: string;
  twWaitType: string;
  twWorkflowOnly: string;
  userEstimatedDuration: null | any;
  variables: any[];
  version: number;
  virtualResources: any[];
}
