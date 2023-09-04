import { readFileSync, writeFileSync } from 'fs';
import { INumberDictionary, Ivertice, WorkflowNode, TreeNode, IStringDictionary, Environment } from './interfaces';
import { homedir } from 'os';

var id = 0;
let counter: INumberDictionary = {};
//let envTable: IStringDictionary = {};

export function readToken(cfg: Environment[string]) {
  try {
    const homeDir = homedir();
    const filePath = cfg.token.replace(/^~(?=$|\/|\\)/, homeDir);
    return readFileSync(filePath, "utf-8");

  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw {
        message: "Token ikke fundet",
        detail: `For at ungå denne fejl skal der oprettes en token: ${cfg.token}`,
        status: 404
      };
    } else {
      throw {
        message: "Fejl ved læsning af token",
        detail: `e.message ${cfg.token}`,
        status: 500
      };

    }
  }
}

export function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
  for (const wkfNode of workflowSet) {
    if (wkfNode.name == name) {
      return wkfNode;
    }
  }
  return {} as WorkflowNode;
}

export function getParm(request: any, parm: string) {
  let p = "";
  p = request.query[parm];
  console.log("getParm: ", p);
  return p;
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
    // Only top level nodes
    if (wkf.name && counter[wkf.name] === 0) {
      wkf.name = wkf.name.trim().replace(/-/g, "_");
      // Det ser ud til at topLevelName ikke bliver brugt.
      let topLevelName = wkf.name;
      count = parse(workflow, data, wkf.name, topLevelName);
      sequence[wkf.name] = count;
    }
  }
  // console.log("No of nodes before ", workflow.length);
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

// Det ser ud til at topLevelName ikke bliver brugt.
// Build TreeNodes from WorkflowNodes
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

export function deepMerge(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  if (target === undefined) target = Array.isArray(source) ? [] : {};

  if (typeof target !== 'object' || target === null) {
    return source;
  }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}


export function deepMerge4(target: any, source: any) {
  const output = { ...target };

  if (typeof source === 'object' && source !== null) {
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = key in target
          ? deepMerge(target[key], source[key])
          : source[key];
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}

export function deepMerge3(target: any, source: any) {
  const output: any = { ...target };

  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        output[key] = { ...source[key] };
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
export function deepMerge2(target: any, source: any) {
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

export function sortPlan(workflows: WorkflowNode[]) {
  const graph = createGraph(workflows as Task[]);
  let sortedTasks = topologicalSort(graph);

  const workflownames = workflows.filter(task => task.type === 'taskWorkflow').map(task => task.name);
  if (sortedTasks) {
    sortedTasks = sortedTasks.filter((task) => workflownames.includes(task));
  }
  return sortedTasks;
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
