import { createReadStream, readFileSync, writeFileSync } from "fs";
import { WorkflowResult, WorkflowNode, ParmItem, Environment, INumberDictionary, TreeNode, Ivertice } from "./interfaces";
import * as readline from 'readline';
import { config } from "./apiConfig";
import { deleteTask, remove_task_from_workflow } from "./uacApi";

let counter: INumberDictionary = {};
var id = 0;

export async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowResult> {
    const fileStream = createReadStream(filePath, { encoding: 'utf-8' });

    console.log('readFileAndParseWorkflow ', filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineNumber = 0;
    let count = 0;
    const workflowItems: WorkflowNode[] = [];
    const parmItems: ParmItem[] = [];
    let currentWorkflowItem: WorkflowNode | null = null;

    for await (const line of rl) {

        lineNumber++;
        if (line.trim().startsWith('#')) {
            continue;
        }

        let taskLine = line.split('#')[0].trim();
        if (taskLine.trim().length === 0) {
            continue;
        }

        console.log(`Read taskline: ${taskLine}`);
        const result = parseLine(taskLine);

        if (!result.ok) {
            return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
        }
        console.log(`result: ${JSON.stringify(result)}`);

        count++;
        if (result.parmMatched) {
            handleParm(parmItems, result.parmItem);
        } else if (result.groupNameMatched) {
            currentWorkflowItem = handleGroup(currentWorkflowItem, workflowItems, result.groupName);
        } else if (currentWorkflowItem) {
            handleWorkflowItem(currentWorkflowItem, result.groupMember, result.dependant);
        } else {
            console.log(`No match ${result.parmMatched}`);
            return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
        }
    }

    if (currentWorkflowItem) {
        workflowItems.push(currentWorkflowItem);
    }
    console.log(`readAndFParseWorkflow Parm Items ${JSON.stringify(parmItems)}`);
    return { workflowItems, parmItems, count, ok: true };
}

export const checkDollarSign = (filePath: string): boolean => {
    const fileContent = readFileSync(filePath, 'utf-8');
    return fileContent.includes('$');
};


function handleParm(parmItems: ParmItem[], parmItem: ParmItem) {
    if (Object.keys(parmItem).length > 0) {
        parmItems.push(parmItem)
    }
}

function handleWorkflowItem(currentWorkflowItem: WorkflowNode, groupMember: string, dependant: string) {
    console.log("handleWorkflowItem()");
    const item = {
        task: {
            value: groupMember.trim()
        },
        dependant
    };
    if (item && currentWorkflowItem.workflowVertices) {
        currentWorkflowItem.workflowVertices.push(item);
    }
}

function handleGroup(currentWorkflowItem: WorkflowNode | null, workflowItems: WorkflowNode[], groupName: string) {
    console.log(`Add group: ${groupName}`);
    if (currentWorkflowItem) {
        // console.log(`Add group member: ${currentWorkflowItem.name}`);
        workflowItems.push(currentWorkflowItem);
    }
    // console.log("groupName: ", groupName);
    currentWorkflowItem = {
        name: groupName,
        type: "taskWorkflow",
        workflowVertices: [],
    };
    console.log(`Create currentWorkflowItem: ${currentWorkflowItem.name}`);
    return currentWorkflowItem;
}

function parseLine(line: string) {

    console.log("parseLine()");
    // console.log("Try groupName");
    let groupName = "";
    const groupNameMatched = line.match(/^([\wæøåÆØÅ]+):$/);
    if (groupNameMatched) {
        // console.log("groupName matched");
        groupName = groupNameMatched[1];
        console.log("  ", groupName);
    }
    // console.log(groupNameMatched);

    // console.log("Try groupMember");
    let groupMember = "";
    const groupMemberMatched = line.match(/^([\wæøåÆØÅ]+)$/);
    if (groupMemberMatched) {
        // console.log("groupMember matched");
        groupMember = groupMemberMatched[1];
        console.log("  ", groupMember);
        console.log("  ", groupMemberMatched);
    }
    // console.log(groupMemberMatched);

    // console.log("Try groupMember + dependant");
    let dependant = ""
    const dependanceMatched = line.match(/^([\wæøåÆØÅ]+) *-> *([\wæøåÆØÅ]+)$/);
    if (dependanceMatched) {
        // console.log("groupMember dependancy matched");
        groupMember = dependanceMatched[1];
        dependant = dependanceMatched[2];
        console.log(dependanceMatched);
        console.log(`  groupMember ${groupMember}, dependant ${dependant}`);
    }
    // console.log(dependanceMatched);

    let parmItem = { task: "", parameter: "" };
    const parmMatched = line.match(/^([\wæøåÆØÅ]+) *= *(.*)$/);
    if (parmMatched) {
        // console.log("Parm matched");
        const task = parmMatched[1].trim();
        const parameter = parmMatched[2].trim();
        parmItem = { task, parameter };
    }
    // console.log(parmMatched);

    const ok = groupNameMatched || groupMemberMatched || dependanceMatched || parmMatched;
    return { ok, groupNameMatched, groupMemberMatched, dependanceMatched, parmMatched, groupName, groupMember, dependant, parmItem, }
}


export const deleteOldPlan = async (cfg: Environment[string], env: string, workflows: WorkflowNode[]) => {
    let curWorkflows = [];
    console.log(`deleteOldPlan: ${config.dataDir}/${env}_plan.json`);
    curWorkflows = JSON.parse(readFileSync(`${config.dataDir}/${env}_plan.json`, 'utf-8'));
    await deletePlan(cfg, workflows, curWorkflows);
}

export async function deletePlan(cfg: Environment[string], workflows: WorkflowNode[], sortedPlan: string[]): Promise<void> {
    for (const name of sortedPlan) {
        const wf = getWkfByName(workflows, name);
        await deleteNode(cfg, wf);
    }
}

async function deleteNode(cfg: Environment[string], node: WorkflowNode): Promise<void> {
    const name = `${cfg.prefix}_${node.name}_wkf`;
    console.log(`deleteNode ${cfg.prefix} ${node.name} ${name}`);
    const response = await deleteTask(cfg, name)
    if (response.ok) {
        return
    }
    if (response.status === 404) {
        // console.log("task findes ikke det er OK, så er vi færdige");
        return;
    }
    if (response.status === 403) {
        console.log(`Task findes ${name} men må ikke slettes, fjern vertices istedet`);
        if (node?.workflowVertices) {
            for (const item of node.workflowVertices) {
                const itemName = `${cfg.prefix}_${item.task.value}_wkf`;
                const rmResponse = await remove_task_from_workflow(cfg, itemName, name);
                if (!rmResponse.ok) {
                    // console.log("remove task from workflow failed ", rmResponse.status, rmResponse);
                    throw {
                        message: 'Fjern task fejlet',
                        detail: `Fjern ${itemName} fra ${name} fejlet: ${rmResponse.statusText}`,
                        status: 403
                    };
                }
            }
        }
        return;
    }
    throw {
        message: 'Delete task fejlet',
        detail: `Sletning af ${name} fejlet: ${response.statusText}`,
        status: 500
    };
}


// Det ser ud til at topLevelName ikke bliver brugt.
// Build TreeNodes from WorkflowNodes
export function parse(workflow: TreeNode[], wkf: WorkflowNode[], name: string, topLevelName: string): number {
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

export function getParm(request: any, parm: string) {
    let p = "";
    p = request.query[parm];
    console.log("getParm: ", p);
    return p;
}

export function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
    for (const wkfNode of workflowSet) {
        if (wkfNode.name == name) {
            return wkfNode;
        }
    }
    return {} as WorkflowNode;
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

export function findTopLevel(workflows: WorkflowNode[]) {
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
        // Only top level nodes
        // console.log(`util.ts: handleData ${wkf.name}`)
        if (wkf.name && counter[wkf.name] === 0) {
            // console.log(`  count: ${count}`)
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
