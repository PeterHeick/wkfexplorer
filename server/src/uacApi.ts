import { Response } from 'express'
import { readToken } from "./apiUtil";
import { Environment, WorkflowNode } from "./interfaces";
import { handleData } from './util';
import { global } from "./global";

export function fetchTask(res: Response, cfg: Environment[string], task: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}/`;
  const url = `uc/resources/task/?taskname=${task}`;
  const token = readToken(cfg.token);

  if (token === "") {
    res.status(404).send("Token not found");
    return;
  }

  const headers = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }

  fetch(baseUrl + url, headers)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error: any) => {
      console.error(error)
      res.status(404).send(error);
    });
}

export function fetchWorkflows(res: Response, cfg: Environment[string], env: string, pattern: string) {
  const baseUrl = `https://${cfg.uachost}:${cfg.uacport}`;
  const url = `${baseUrl}/uc/resources/task/listadv?taskname=${pattern}&type=workflow`
  const token = readToken(cfg.token);

  if (token === "") {
    res.status(404).send("Token not found");
    return;
  }

  console.log(url);
  const headers = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Host: `${cfg.uachost}:${cfg.uacport}`,
      "Sec-Fetch-Site": "cross-site"
    }
  }

  fetch(url, headers)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then(error => { throw new Error(error.message) });
      }
    })
    .then((data: WorkflowNode[]) => {
      console.log(typeof data);

      global.setWorkflow(data, env);
      const sorted = handleData(data, cfg.pattern);
      console.log("sorted ", sorted.length);
      res.status(200).json(sorted);
    })
    .catch((error: any) => {
      console.error(error)
      res.status(404).send(error);
    });
}