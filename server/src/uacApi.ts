/*

Funktions to communicate with UAC Universal Automation Center

*/

import { readToken } from "./util";
import { Environment } from "./interfaces";

export async function readTask(cfg: Environment[string], task: string): Promise<Response> {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
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

export async function updateTask(cfg: Environment[string], body: any) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task`
  const token = readToken(cfg);

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
  // console.log(url);
  // console.log(options);
  return await fetch(url, options);
};

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

export async function remove_task_from_workflow(cfg: Environment[string], task: string, workflow: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/vertices?workflowname=${workflow}`
  const token = readToken(cfg);
  console.log(`remove_task ${task} from ${workflow}`);

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