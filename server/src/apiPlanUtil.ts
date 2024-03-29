import { createReadStream, readFileSync, unlinkSync, writeFileSync } from "fs";
import { WorkflowResult, WorkflowNode, ParmItem, Environment, INumberDictionary, TreeNode, Ivertice } from "./interfaces";
import * as readline from 'readline';
import { config } from "./apiConfig";
import { deleteTask, remove_task_from_workflow } from "./uacApi";

let counter: INumberDictionary = {};
var id = 0;

export async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowResult> {
    const fileStream = createReadStream(filePath, { encoding: 'latin1' });
    //const fileStream = createReadStream(filePath, { encoding: 'utf-8' });

    console.log('  readFileAndParseWorkflow ', filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineNumber = 0;
    let count = 0;
    const workflowItems: WorkflowNode[] = [];
    const parmItems: ParmItem[] = [];
    let currentWorkflowItem: WorkflowNode | null = null;
    let delimiter = "-";

    for await (const line of rl) {

        lineNumber++;
        if (line.trim().startsWith('#')) {
            continue;
        }

        let taskLine = line.split('#')[0].trim();
        if (taskLine.trim().length === 0) {
            continue;
        }
        console.log(`  Read taskline: ${line}`);
        const comment = line.split('#')[1];
        console.log(`comment: ${comment}`);
        const delim = taskLine.match(/^delimiter *= *'(.)'$/i);
        if (delim) {
            delimiter = delim[1];
            console.log(`    Delimiter: '${delimiter}'`);
            continue;
        }

        // console.log(`    Read taskline: ${taskLine}`);
        const result = parseLine(taskLine, delimiter);

        if (!result.ok) {
            return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
        }
        // console.log(`    result: ${JSON.stringify(result)}`);

        count++;
        if (result.parmMatched) {
            handleParm(parmItems, result.parmItem);
        } else if (result.groupNameMatched) {
            currentWorkflowItem = handleGroup(currentWorkflowItem, workflowItems, result.groupName, result.description);
        } else if (currentWorkflowItem) {
            handleWorkflowItem(currentWorkflowItem, result.groupMember, result.dependant, comment);
        } else {
            console.log(`    No match ${result.parmMatched}`);
            return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
        }
    }

    if (currentWorkflowItem) {
        workflowItems.push(currentWorkflowItem);
    }
    return { workflowItems, parmItems, count, ok: true };
}

export const checkMasterPlan = (filePath: string): boolean => {
    const fileContent = readFileSync(filePath, 'utf-8');
    return fileContent.includes('${UGE}') && fileContent.includes('${MANDAG}');
};


function handleParm(parmItems: ParmItem[], parmItem: ParmItem) {
    if (Object.keys(parmItem).length > 0) {
        parmItems.push(parmItem)
    }
}

function handleWorkflowItem(currentWorkflowItem: WorkflowNode, groupMember: string, dependant: string, comment: string) {
    // console.log("  handleWorkflowItem()");
    const item = {
        task: {
            value: groupMember.trim()
        },
        dependant,
        comment
    };
    console.log(`name: ${item.task.value} comment: ${item.comment}`)
    if (item && currentWorkflowItem.workflowVertices) {
        currentWorkflowItem.workflowVertices.push(item);
    }
}

function handleGroup(currentWorkflowItem: WorkflowNode | null, workflowItems: WorkflowNode[], groupName: string, description: string) {
    console.log(`  Add group: ${groupName}`);
    if (currentWorkflowItem) {
        // console.log(`Add group member: ${currentWorkflowItem.name}`);
        workflowItems.push(currentWorkflowItem);
    }
    // console.log("groupName: ", groupName);
    currentWorkflowItem = {
        name: groupName,
        summary: description,
        type: "taskWorkflow",
        workflowVertices: [],
    };
    console.log(`  Create currentWorkflowItem: ${currentWorkflowItem.name}`);
    return currentWorkflowItem;
}

function parseLine(line: string, delimiter: string = "-") {

    let groupName = "";
    let description = "";
    const groupNameMatched = line.match(/^([\wæøåÆØÅ]+): *("([^"]*)")?$/);
    if (groupNameMatched) {
        groupName = groupNameMatched[1];
        description = groupNameMatched[3];
        description = "";
        // console.log(`  Group: ${groupName}`);
        // console.log(`  Description: ${description}`);
    }

    let groupMember = "";
    const groupMemberMatched = line.match(/^([\wæøåÆØÅ]+)$/);
    if (groupMemberMatched) {
        groupMember = groupMemberMatched[1];
    }

    let dependant = ""
    const dependanceMatched = line.match(/^([\wæøåÆØÅ]+) *-> *([\wæøåÆØÅ]+)$/);
    if (dependanceMatched) {
        groupMember = dependanceMatched[1];
        dependant = dependanceMatched[2];
    }

    let parmItem = { task: "", parameter: "" };
    const parmMatched = line.match(/^([\wæøåÆØÅ]+) *= *(.*)$/);
    if (parmMatched) {
        const task = parmMatched[1].trim();
        let parameter = parmMatched[2].trim();
        console.log(`    Parm: ${task} = ${parameter}`);
        parameter = parameter.replace(new RegExp(delimiter, 'g'), '');
        console.log(`    Parm: ${task} = ${parameter}`);
        parmItem = { task, parameter };
    }

    const ok = groupNameMatched || groupMemberMatched || dependanceMatched || parmMatched;
    return { ok, groupNameMatched, groupMemberMatched, dependanceMatched, parmMatched, groupName, description, groupMember, dependant, parmItem, }
}


export const deleteOldPlan = async (cfg: Environment[string], env: string, plan: string) => {
    // let curWorkflows: WorkflowNode[] = [];
    // let topLevelNames: string[] = [];
    console.log(`  deleteOldPlan: ${config.dataDir}/${env}_${plan}_plan.json`);
    try {
        let { workflows, topLevelNames } = JSON.parse(readFileSync(`${config.dataDir}/${env}_${plan}_plan.json`, 'utf-8'));
        await deletePlan(cfg, workflows, topLevelNames);
        // unlinkSync(`${config.dataDir}/${env}_${plan}_plan.json`);
    }
    catch (error) {
        console.log(`  deleteOldPlan: ${config.dataDir}/${env}_${plan}_plan.json findes ikke, så ikke noget at slette`);
    }
}

export async function deletePlan(cfg: Environment[string], workflows: WorkflowNode[], sortedPlan: string[]): Promise<void> {
    for (const name of sortedPlan) {
        const wf = getWkfByName(workflows, name);
        await deleteNode(cfg, wf);
    }
}

async function deleteNode(cfg: Environment[string], node: WorkflowNode): Promise<void> {
    const name = `${cfg.prefix}_${node.name}_wkf`;
    console.log(`  deleteNode ${cfg.prefix} ${node.name} ${name}`);
    const response = await deleteTask(cfg, name)
    if (response.ok) {
        return
    }
    if (response.status === 404) {
        // console.log("task findes ikke det er OK, så er vi færdige");
        return;
    }
    if (response.status === 403) {
        console.log(`    Task findes ${name} men må ikke slettes, fjern vertices istedet`);
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
/**
 * Parses a workflow and returns the count of nodes.
 * @param workflow - The workflow to parse.
 * @param wkf - The workflow node.
 * @param name - The name of the node.
 * @param topLevelName - The name of the top level node.
 * @returns The count of nodes.
 */
export function parse(workflow: TreeNode[], wkf: WorkflowNode[], name: string, topLevelName: string, comment: string): number {
    let wkfNode = getWkfByName(wkf, name);

    id++;
    let count = 0;
    let newNode: TreeNode = {
        id,
        name,
        type: wkfNode.type,
        isVisible: false,
        comment: comment,
        workflow: []
    };

    if (!newNode.type || newNode.type === "") {
        newNode.type = "taskUnix";
    }
    workflow.push(newNode);

    if (wkfNode.workflowVertices) {
        //        newNode.workflow = [];
        wkfNode.workflowVertices.forEach((vertice: Ivertice) => {
            if (vertice?.task?.value) {
                count = parse(newNode.workflow, wkf, vertice.task.value, topLevelName, vertice.comment as string) + 1;
            }
        })
    }
    return count;
}

/**
 * Returns the value of the specified parameter from the request query string.
 * @param request - The request object.
 * @param parm - The name of the parameter to retrieve.
 * @returns The value of the specified parameter from the request query string.
 */
export function getParm(request: any, parm: string) {
    let p = "";
    p = request.query[parm];
    return p;
}

/**
 * Returns the WorkflowNode object with the given name from the provided array of WorkflowNode objects.
 * @param workflowSet - The array of WorkflowNode objects to search in.
 * @param name - The name of the WorkflowNode object to find.
 * @returns The WorkflowNode object with the given name, or an empty object if not found.
 */
export function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
    for (const wkfNode of workflowSet) {
        if (wkfNode.name == name) {
            return wkfNode;
        }
    }
    return {} as WorkflowNode;
}


/**
 * Sorts an array of WorkflowNode objects in topological order based on their dependencies.
 * @param workflows An array of WorkflowNode objects to be sorted.
 * @returns An array of sorted WorkflowNode objects.
 */
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

/**
 * Performs a topological sort on a given graph.
 * @param graph - The graph to be sorted.
 * @returns An array of strings representing the sorted nodes in the graph.
 */
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
/**
 * Creates a graph object from an array of tasks.
 * @param tasks An array of Task objects.
 * @returns A Graph object representing the dependencies between tasks.
 */
function createGraph(tasks: Task[]): Graph {
    const graph: Graph = {};

    for (const task of tasks) {
        if (task.type === 'taskWorkflow' && task.workflowVertices.length > 0) {
            graph[task.name] = task.workflowVertices.map(v => v.task.value).filter(Boolean);
        }
    }

    return graph;
}

/**
 * Performs a topological sort on a graph starting from a given vertex.
 * @param v - The vertex to start the sort from.
 * @param visited - An object containing the visited vertices.
 * @param stack - An array containing the sorted vertices.
 * @param graph - The graph to perform the sort on.
 */
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

/**
 * Finds the top level workflows from an array of WorkflowNode objects and writes the count of each workflow to a JSON file.
 * @param workflows An array of WorkflowNode objects.
 */
export function findTopLevel(workflows: WorkflowNode[]) {
    console.log("  toplevel");
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
/**
 * Handles the given data and returns an array of tree nodes.
 * @param data An array of WorkflowNode objects.
 * @returns An array of TreeNode objects.
 */
export function handleData(data: WorkflowNode[]): TreeNode[] {
    let workflow: TreeNode[] = [];
    let count = 0;
    let sequence: INumberDictionary = {};

    findTopLevel(data);

    console.log("  after toplevel");
    id = 0;
    for (const wkf of data) {
        // Only top level nodes
        // console.log(`util.ts: handleData ${wkf.name}`)
        if (wkf.name && counter[wkf.name] === 0) {
            // console.log(`  count: ${count}`)
            wkf.name = wkf.name.trim().replace(/-/g, "_");
            // Det ser ud til at topLevelName ikke bliver brugt.
            let topLevelName = wkf.name;
            count = parse(workflow, data, wkf.name, topLevelName, "");
            sequence[wkf.name] = count;
        }
    }
    // console.log("No of nodes before ", workflow.length);
    workflow.sort((a: TreeNode, b: TreeNode) => {
        if (a.name && b.name) {
            return a.name.localeCompare(b.name);
        } else {
            return 0;
        }
    });

    /*
        workflow.sort((a: TreeNode, b: TreeNode) => {
            if (a.name && b.name) {
                return sequence[b.name] - sequence[a.name];
            }
            else {
                return 0;
            }
        });
        */

    // writeFileSync('../sorted.json', JSON.stringify(workflow));
    return workflow;
}
