import { isGeneratorFunction } from "util/types";
import { INumberDictionary, Ivertice, IworkflowNode, ItreeNode, emptyWorkflowNode } from "./interfaces";

var id = 0;
let counter: INumberDictionary = {};
function findTopLevel(workflows: IworkflowNode[]) {

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
    let c = 0;
    for (const key in counter) {
      if (counter[key] === 0)
        c += 1;
    }
  }
  
  
export function handleData(data: IworkflowNode[]): ItreeNode[] {
    findTopLevel(data);
    for (const key in counter) {
    }
  
    let workflow: ItreeNode[] = [];
    let count = 0;
    let sequence: INumberDictionary = {};
    for (const wkf of data) {
      if (wkf.name && counter[wkf.name] === 0) {
        count = parse(workflow, data, wkf.name);
        sequence[wkf.name] = count;
      }
    }
    workflow.sort((a: ItreeNode, b: ItreeNode) => {
      if (a.name && b.name) {
        return sequence[b.name] - sequence[a.name];
      }
      else {
        return 0;
      }
    });
    return workflow;
  }

function getWkfByName(workflowSet: IworkflowNode[], name: string): IworkflowNode {
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
function parse(workflow: ItreeNode[], wkf: IworkflowNode[], name: string): number {
    let wkfNode = getWkfByName(wkf, name);
  
    id++;
    let count = 0;
    let newNode: ItreeNode = {
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

    workflow.push(newNode);
  
    switch (wkfNode?.type) {
      case 'taskWorkflow':
        // if (wkfNode.workflowVertices && wkfNode.hasOwnProperty("workflowVertices")) {
        if (wkfNode.workflowVertices) {
          newNode.workflow = [];
          wkfNode.workflowVertices.forEach((vertice: Ivertice) => {
            if (vertice?.task?.value) {
              count = parse(newNode.workflow, wkf, vertice.task.value) + 1;
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