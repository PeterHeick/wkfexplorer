import { writeFileSync } from 'fs';
import { INumberDictionary, Ivertice, WorkflowNode, TreeNode, emptyWorkflowNode, IStringDictionary } from './interfaces';

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
  /*
  let c = 0;
  for (const key in counter) {
    if (counter[key] === 0)
      c += 1;
  }
  */
}


export function handleData(data: WorkflowNode[], credentials: string): TreeNode[] {
  id = 0;
  findTopLevel(data);
  /*
  for (const key in counter) {
  }
*/

  let workflow: TreeNode[] = [];
  let count = 0;
  let sequence: INumberDictionary = {};
  writeFileSync('../counter.json', JSON.stringify(counter));
  for (const wkf of data) {
    if (wkf.name && counter[wkf.name] === 0) {
      wkf.name = wkf.name.trim().replace(/-/g, "_");
      let topLevelName = wkf.name;
      envTable[topLevelName] = new Set<string>();
      count = parse(workflow, data, wkf.name, topLevelName);
      sequence[wkf.name] = count;
    }
  }
  workflow.sort((a: TreeNode, b: TreeNode) => {
    if (a.name && b.name) {
      return sequence[b.name] - sequence[a.name];
    }
    else {
      return 0;
    }
  });
  // console.log(envTable);
  console.log(credentials);
  console.log(workflow[0].name);
  console.log(envTable[workflow[0].name]);

  writeFileSync('../sorted.json', JSON.stringify(workflow));
  return workflow;
  /*
  return workflow.filter((a) => {
    if (a && a.name) {
      return envTable[a.name].has(credentials);
    } else {
      return false;
    }})
    */
}

function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
  for (const wkfNode of workflowSet) {
    if (wkfNode.name == name) {
      return wkfNode;
    }
  }
  return emptyWorkflowNode
}


// workflow resultat af parse
// Array af workflows
// Navn på current workflow node
function parse(workflow: TreeNode[], wkf: WorkflowNode[], name: string, topLevelName: string): number {
  let wkfNode = getWkfByName(wkf, name);

  id++;
  let count = 0;
  let newNode: TreeNode = {
    id,
    name,
    type: wkfNode.type,
    summary: wkfNode.summary,
    version: wkfNode.version,
    opswiseGroups: wkfNode.opswiseGroups,
    remoteServer: wkfNode.remoteServer,
    agent: wkfNode.agent,
    credentials: wkfNode.credentials,
    runAsSudo: wkfNode.runAsSudo,
    resolveNameImmediately: wkfNode.resolveNameImmediately,
    timeZonePref: wkfNode.timeZonePref,
    resPriority: wkfNode.resPriority,
    startHeld: wkfNode.startHeld,
    exclusiveWithSelf: wkfNode.exclusiveWithSelf,
    agentCluster: wkfNode.agentCluster || "",

    color: "white",
    isVisible: false,
    workflow: []
  };

  if (newNode.type === "") {
    newNode.type = "task";
  }
  workflow.push(newNode);
  if (newNode.credentials) {
    envTable[topLevelName].add(newNode.credentials);
  }

  switch (wkfNode?.type) {
    case 'taskWorkflow':
      // if (wkfNode.workflowVertices && wkfNode.hasOwnProperty("workflowVertices")) {
      if (wkfNode.workflowVertices) {
        newNode.workflow = [];
        wkfNode.workflowVertices.forEach((vertice: Ivertice) => {
          if (vertice?.task?.value) {
            count = parse(newNode.workflow, wkf, vertice.task.value, topLevelName) + 1;
          }
        })
      }
      break;
    case 'taskUnix':
      newNode.command = wkfNode.command;
      count = 1;
      break;
    case 'taskEmail':
      count = 1;
      break;
    case 'taskFtp':
      newNode.remoteServer = wkfNode.remoteServer;
      newNode.localFilename = wkfNode.localFilename;
      newNode.remoteFilename = wkfNode.remoteFilename;
      count = 1;
      break;

    default:
      break;
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
