import { readToken } from "./apiUtil";
import { Environment, WorkflowNode } from "./interfaces";

export async function readTask(cfg: Environment[string], task: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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
  console.log(url);
  console.log(options);
  return await fetch(url, options);
};

export function fetchWorkflows(cfg: Environment[string], prefix: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const pattern = `${prefix}*`;
  console.log(pattern);
  const url = `${baseUrl}/uc/resources/task/listadv?taskname=${pattern}&type=workflow`
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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

  return fetch(url, options);
}


export async function deleteTask(cfg: Environment[string], task: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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

export async function createTask(cfg: Environment[string], env: string, task: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task?taskname=${task}`
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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

export async function createWorkflow(cfg: Environment[string], workflow: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task`
  const token = readToken(cfg.token);
  console.log("createWorkflows");

  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

  const body = {
    type: "taskWorkflow",
    logLevel: "Inherited",
    name: workflow,
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
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

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

export async function make_edge(cfg: Environment[string], workflow: string, source: number, destination: number) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/workflow/edges?workflowname=${workflow}`
  const token = readToken(cfg.token);
  if (token === "") {
    throw {
      message: "Token ikke fundet",
      detail: `For at ungå denne fejl skal der oprettes en token i H:\\uac\\${cfg.token}`
    };
  }

  const body = {
    straightEdge: true,
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