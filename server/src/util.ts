import { writeFileSync } from 'fs';
import { INumberDictionary, Ivertice, WorkflowNode, TreeNode, IStringDictionary, Environment } from './interfaces';
import { wkfData } from './wkfData';

var id = 0;
let counter: INumberDictionary = {};
//let envTable: IStringDictionary = {};

function findTopLevel(workflows: WorkflowNode[]) {
  console.log("toplevel");
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

// kaldt fra api/plan og api/listadv
export function handleData(data: WorkflowNode[]): TreeNode[] {
  let workflow: TreeNode[] = [];
  let count = 0;
  let sequence: INumberDictionary = {};

  findTopLevel(data);

  console.log("after toplevel");
  id = 0;
  for (const wkf of data) {
    if (wkf.name && counter[wkf.name] === 0) {
      wkf.name = wkf.name.trim().replace(/-/g, "_");
      let topLevelName = wkf.name;
      count = parse(workflow, data, wkf.name, topLevelName);
      sequence[wkf.name] = count;
    }
  }
  console.log("No of nodes before ", workflow.length);
  workflow.sort((a: TreeNode, b: TreeNode) => {
    if (a.name && b.name) {
      return sequence[b.name] - sequence[a.name];
    }
    else {
      return 0;
    }
  });

  // writeFileSync('../sorted.json', JSON.stringify(workflow));
  return workflow;
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
    isVisible: false,
    workflow: []
  };

  if (!newNode.type || newNode.type === "") {
    newNode.type = "taskUnix";
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

export function deepMerge(target: any, source: any) {
  const output: Environment = { ...target } as Environment;

  for (const key in source) {
    if (typeof source[key] === "object") {
      if (!(key in target)) {
        output[key] = { ...source[key] } as typeof target[string];
      } else {
        output[key] = deepMerge(target[key], source[key]) as typeof target[string];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}


interface Vertex {
  task: {
    value: string;
  };
}

interface Task {
  name: string;
  type: string;
  workflowVertices: Vertex[];
  [key: string]: unknown;
}

interface Graph {
  [index: string]: string[];
}

function createGraph(tasks: Task[]): Graph {
  const graph: Graph = {};

  for (const task of tasks) {
    if (task.type === 'taskWorkflow' && task.workflowVertices.length > 0) {
      graph[task.name] = task.workflowVertices.map(v => v.task.value).filter(Boolean);
    }
  }

  return graph;
}

function topologicalSortUtil(v: string, visited: { [index: string]: boolean }, stack: string[], graph: Graph) {
  visited[v] = true;

  if (graph[v]) {
    for (const neighbour of graph[v]) {
      if (!visited[neighbour]) {
        topologicalSortUtil(neighbour, visited, stack, graph);
      }
    }
  }

  stack.push(v);
}

function topologicalSort(graph: Graph) {
  const stack: string[] = [];
  const visited: { [index: string]: boolean } = {};

  for (const node in graph) {
    if (!visited[node]) {
      topologicalSortUtil(node, visited, stack, graph);
    }
  }

  return stack;
}

export function getNewPlan() {
  const workflowsTasks = wkfData.getPlan();
  const graph = createGraph(workflowsTasks as Task[]);
  let sortedTasks = topologicalSort(graph);

  const workflownames = workflowsTasks.filter(task => task.type === 'taskWorkflow').map(task => task.name);
  if (sortedTasks) {
    sortedTasks = sortedTasks.filter((task) => workflownames.includes(task));
  }
  return sortedTasks;
}

// Brug af funktionerne:
/*
const graph = createGraph(tasks);
const sortedTasks = topologicalSort(graph);

console.log(sortedTasks);
*/