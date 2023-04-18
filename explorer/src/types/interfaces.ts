
export interface Ivertice {
  alias?: string;
  task?: {
    value: string;
  };
  vertexId?: string;
  vertexX?: string;
  vertexY?: string;
}

export interface IworkflowNode {
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
  workflowVertices?: Ivertice[];
  [key: string]: unknown;
}

export interface ItreeNode {
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
  
  isVisible: boolean;
  color: string;
  workflow: ItreeNode[];
}

export const emptyWorkflowNode: IworkflowNode = {
  name: "",
  type: "",
  summary: "",
  command: "",
  commandOrScript: "",
  opswiseGroups: [],
  remoteServer: "",
  localFilename: "",
  remoteFilename: "",
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
  uac: IworkflowNode[];
  globalUacConfig: Iconfig;
  userUacConfig: IuserConfig;
  uacenv: string;
}

