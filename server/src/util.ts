import { writeFileSync } from 'fs';
import { INumberDictionary, Ivertice, WorkflowNode, TreeNode, IStringDictionary, Environment } from './interfaces';

var id = 0;
let counter: INumberDictionary = {};
let envTable: IStringDictionary = {};

function findTopLevel(workflows: WorkflowNode[]) {
  counter = {};
  for (const wkf of workflows) {
    if (wkf.name) {
      if (counter[wkf.name] === undefined) {
        counter[wkf.name] = 0;
      } else {
        counter[wkf.name] += 1;
      }
    }
    if (wkf.type === "taskWorkflow") {
      if (wkf.workflowVertices) {
        for (const vertice of wkf.workflowVertices) {
          if (vertice?.task) {
            if (counter[vertice?.task?.value] === undefined) {
              counter[vertice.task.value] = 0;
            } else {
              counter[vertice.task.value] += 1;
            }
          }
        }
      }
    }
  }
  writeFileSync('../counter.json', JSON.stringify(counter));
}

export function handleData(data: WorkflowNode[], pattern: string): TreeNode[] {
  let workflow: TreeNode[] = [];
  let count = 0;
  let sequence: INumberDictionary = {};

  findTopLevel(data);

  id = 0;
  for (const wkf of data) {
    if (wkf.name && counter[wkf.name] === 0) {
      wkf.name = wkf.name.trim().replace(/-/g, "_");
      let topLevelName = wkf.name;
      envTable[topLevelName] = new Set<string>();
      count = parse(workflow, data, wkf.name, topLevelName);
      sequence[wkf.name] = count;
    }
  }
  const re = new RegExp(pattern);
  const workflowFiltered = workflow.filter((wkf) => re.test(wkf.name));
  workflowFiltered.sort((a: TreeNode, b: TreeNode) => {
    if (a.name && b.name) {
      return sequence[b.name] - sequence[a.name];
    }
    else {
      return 0;
    }
  });
  // console.log(envTable);
  console.log("Pattern ",pattern);
  // console.log(JSON.stringify(workflowFiltered));
  if (workflowFiltered.length > 0) {
    console.log(workflowFiltered[0].name);
    console.log(envTable[workflowFiltered[0].name]);
  }

  writeFileSync('../sorted.json', JSON.stringify(workflowFiltered));
  return workflowFiltered;
}

function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
  for (const wkfNode of workflowSet) {
    if (wkfNode.name == name) {
      return wkfNode;
    }
  }
  return {} as WorkflowNode;
}

function parse(workflow: TreeNode[], wkf: WorkflowNode[], name: string, topLevelName: string): number {
  let wkfNode = getWkfByName(wkf, name);

  id++;
  let count = 0;
  let newNode: TreeNode = {
    id,
    name,
    type: wkfNode.type,
    agent: wkfNode.agent,
    exclusiveWithSelf: wkfNode.exclusiveWithSelf,
    opswiseGroups: wkfNode.opswiseGroups,
    resPriority: wkfNode.resPriority,
    startHeld: wkfNode.startHeld,
    summary: wkfNode.summary,
    timeZonePref: wkfNode.timeZonePref,
    version: wkfNode.version,

    color: "white",
    isVisible: false,
    workflow: []
  };

  if (!newNode.type || newNode.type === "") {
    newNode.type = "task";
  }
  workflow.push(newNode);

  if (wkfNode.workflowVertices) {
    newNode.workflow = [];
    wkfNode.workflowVertices.forEach((vertice: Ivertice) => {
      if (vertice?.task?.value) {
        count = parse(newNode.workflow, wkf, vertice.task.value, topLevelName) + 1;
      }
    })
  }
  return count;
}

function handleCircularReferences() {
  const visitedObjects = new WeakSet();

  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (visitedObjects.has(value)) {
        return; // eller returner en brugerdefineret værdi som "CIRCULAR"
      }
      visitedObjects.add(value);
    }
    return value;
  };
}

function fileWriteSync(arg0: string, workflow: TreeNode[]) {
  throw new Error('Function not implemented.');
}

export function deepMerge(target: any, source: any) {
  const output: Environment = { ...target } as Environment;

  for (const key in source) {
    if (typeof source[key] === "object") {
      if (!(key in target)) {
        output[key] = { ...source[key] } as typeof target[string];
      } else {
        output[key] = deepMerge(target[key], source[key])as typeof target[string];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

 

// const mergedConfig: Config = deepMerge(config, userConfig);

// console.log(mergedConfig);
