/*

Funktions to communicate with UAC Universal Automation Center

*/

import { readToken } from "./util";
import { Environment } from "./interfaces";

/**
 * Reads a task from the UAC API.
 * @param cfg - The environment configuration object.
 * @param task - The name of the task to read.
 * @returns A Promise that resolves to a Response object.
 */
export async function readTask(cfg: Environment[string], task: string): Promise<Response> {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
  const token = readToken(cfg);

  console.log(`readTask ${task}`);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }
  return await fetch(url, options);
};

/**
 * Updates a task in the UAC API.
 * @param cfg - The environment configuration object.
 * @param body - The request body.
 * @returns A Promise that resolves to the response from the UAC API.
 */
export async function updateTask(cfg: Environment[string], body: any) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task`
  const token = readToken(cfg);

  body.excludeRelated = true;
  console.log(`updateTask() `)
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    },
    body: JSON.stringify(body)
  }
  return await fetch(url, options);
};

/**
 * Fetches workflows from the UAC API based on the provided configuration and prefix.
 * @param cfg - The environment configuration object.
 * @param prefix - The prefix to use when searching for workflows.
 * @returns A Promise that resolves to the response from the API.
 */
export async function fetchWorkflows(cfg: Environment[string], prefix: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const pattern = `${prefix}_*`;
  console.log("fetcWorkflows");
  const url = `${baseUrl}/uc/resources/task/listadv?taskname=${pattern}&type=workflow`
  const token = readToken(cfg);

  // console.log(url);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }

  console.log("fetchWorkflows: return fetch");
  return fetch(url, options);
}

/**
 * Deletes a task from the UAC server.
 * @param cfg - The environment configuration object.
 * @param task - The name of the task to delete.
 * @returns A Promise that resolves to the response from the server.
 */
export async function deleteTask(cfg: Environment[string], task: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
  const token = readToken(cfg);

  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }

  // console.log(url);
  // console.log(options);
  return await fetch(url, options)

};

/**
 * Creates a new workflow in the UAC API.
 * @param cfg - The environment configuration object.
 * @param name - The name of the workflow to create.
 * @returns A Promise that resolves to a Response object.
 */
export async function createWorkflow(cfg: Environment[string], name: string): Promise<Response> {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task`
  const token = readToken(cfg);
  console.log("createWorkflow", name);

  const response = await readTask(cfg, name);
  // Findes i forvejen
  if (response.ok) {
    return response;
  }
  const body = {
    type: "taskWorkflow",
    logLevel: "Inherited",
    name,
    notes: [],
    opswiseGroups: cfg.business_area,
    summary: "",
    variables: []
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    },
    body: JSON.stringify(body)
  }

  // console.log(url);
  // console.log("options createworkflow ", options);
  return await fetch(url, options);
};

/**
 * Adds a task to a workflow.
 * @param cfg - The environment configuration.
 * @param task - The name of the task to add.
 * @param workflow - The name of the workflow to add the task to.
 * @param x - The x-coordinate of the task in the workflow.
 * @param y - The y-coordinate of the task in the workflow.
 * @returns A Promise that resolves to the response of the API call.
 */
export async function add_task_to_workflow(cfg: Environment[string], task: string, workflow: string, x: number, y: number) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/vertices?workflowname=${workflow}`
  const token = readToken(cfg);
  console.log(`add_task ${task} to ${workflow}`);

  const body =
  {
    alias: null,
    task: {
      value: `${task}`
    },
    vertexX: x,
    vertexY: y
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    },
    body: JSON.stringify(body)
  }

  // console.log(url);
  // console.log(options);
  let ret = 0;
  return await fetch(url, options);
};

/**
 * Retrieves a list of vertices for a given workflow from the UAC API.
 * @param cfg - The environment configuration object.
 * @param workflow - The name of the workflow to retrieve vertices for.
 * @returns A Promise that resolves to the response from the UAC API.
 */
export async function list_vertices(cfg: Environment[string], workflow: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/vertices`
  const token = readToken(cfg);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }
  return await fetch(url, options);
}

/**
 * Removes a task from a workflow.
 * @param cfg - The environment configuration object.
 * @param task - The name of the task to remove.
 * @param workflow - The name of the workflow to remove the task from.
 * @returns A Promise that resolves to the response of the DELETE request.
 */
export async function remove_task_from_workflow(cfg: Environment[string], task: string, workflow: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/vertices?workflowname=${workflow}`
  const token = readToken(cfg);
  console.log(`  remove_task ${task} from ${workflow}`);

  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    },
  }

  // console.log(url);
  // console.log(options);
  let ret = 0;
  return await fetch(url, options);
};

/**
 * Creates an edge between two nodes in a workflow.
 * @param cfg - The environment configuration object.
 * @param workflow - The name of the workflow.
 * @param source - The ID of the source node.
 * @param destination - The ID of the destination node.
 * @param straightEdge - Whether the edge should be straight or curved.
 * @returns A Promise that resolves to the response from the API call.
 */
export async function make_edge(cfg: Environment[string], workflow: string, source: number, destination: number, straightEdge: boolean) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/edges?workflowname=${workflow}`
  const token = readToken(cfg);

  const body = {
    straightEdge,
    sourceId: {
      value: source
    },
    targetId: {
      value: destination
    }
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body)
  }

  // console.log(url);
  // console.log(options);
  return await fetch(url, options)

};
// Disse to bliver ikke brugt

/**
 * Reads the trigger task from the UAC API.
 * @param cfg - The environment configuration object.
 * @param trigger - The name of the trigger.
 * @returns A Promise that resolves to the response from the API.
 */
export async function readTriggerTask(cfg: Environment[string], trigger: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/trigger?triggername=${trigger}`
  const token = readToken(cfg);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }
  // console.log(url);
  // console.log(options);
  return await fetch(url, options);
};


/**
 * Creates a trigger in the UAC API.
 * @param cfg - The environment configuration object.
 * @param data - The trigger data object.
 * @returns A promise that resolves to the fetch response object.
 */
export async function createTrigger(cfg: Environment[string], data: any) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/trigger?triggername=${data.trigger}`
  const token = readToken(cfg);

  const body = {
    type: "triggerTime",
    calendar: data.calendar,
    name: data,
    description: "Trigger oprettet af plan explorer",
    time: data.time,
    tasks: data.tasks,
    opswiseGroups: cfg.business_area,
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    },
    body: JSON.stringify(body)
  }

  // console.log(url);
  // console.log(options);
  return await fetch(url, options)

};