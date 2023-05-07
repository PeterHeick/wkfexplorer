import express from "express";
import path from "path";
import mime from "mime";
import cors from "cors";
import { handleData } from './util';
import { UacConfig, WorkflowNode, Environment } from "./interfaces";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "node:os";
import { exit } from "process";

const docRoot = "docRoot";

export default function api(app: express.Application, config: UacConfig, token: string, uacenv: string, dummyWorkflows: WorkflowNode[], dummyTasks: WorkflowNode[]) {
  app.use(cors());
  app.use(
    express.static(docRoot, {
      setHeaders: (res: any, path: any) => {
        const contentType = mime.getType(path);
        console.log(
          `Middleware Send index.html ${docRoot} ${contentType} ${path}`
        );
        res.setHeader("Content-Type", contentType);
      },
    })
  );

  app.get("/", (req, res) => {
    console.log('\n--- /');
    console.log(`Send index.html ${docRoot}`);
    res.sendFile(path.join(docRoot, "index.html"));
  });

  app.get("/api/environments", (req: any, res: any) => {
    console.log('\n--- /api/environments');
    res.status(200).json(Object.keys(config.environments));
  });

  app.get("/api/uacenv", (req: any, res: any) => {
    console.log('\n--- /uacenv');
    console.log('Send: ', JSON.stringify(uacenv));
    res.status(200).json(uacenv);
  });

  app.get("/api/config", (req: any, res: any) => {
    console.log('\n--- /api/config');
    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = uacenv;
    }
    const cfg = config.environments[env];
    console.log(JSON.stringify(cfg));
    res.status(200).json(cfg);
  });

  app.get("/api/task", (req: any, res: any) => {

    function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
      for (const wkfNode of workflowSet) {
        if (wkfNode.name == name) {
          return wkfNode;
        }
      }
      return {} as WorkflowNode;
    }
    console.log('\n--- /api/task');

    const env = getEnv(req);

    console.log(JSON.stringify(req.query));
    let task = "";
    try {
      task = req.query.taskname;
    } catch (e) {
      task = "Uknown";
    }

    console.log(dummyTasks.length);
    if (dummyTasks.length > 0) {
      console.log(task)
      let wkfNode = getWkfByName(dummyTasks, task);
      console.log(wkfNode.name);
      res.status(200).json(wkfNode);
    } else {
      const cfg = config.environments[env];
      const baseUrl = `https://${cfg.uachost}:${cfg.uacport}/`;
      const url = `uc/resources/task/?taskname=${task}`;
      const token = readToken(env);
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
          writeFileSync('../task.json', JSON.stringify(data));
          res.status(200).json(data);
        })
        .catch((error: any) => console.error(error));
    }
  });

  app.get("/api/listadv", (req: any, res: any) => {
    console.log('\n--- /api/listadv');

    // eks env = "usprod"
    const env = getEnv(req);
    const cfg = config.environments[env];
    const token = readToken(env);

    if (dummyWorkflows.length > 0) {
      const sorted = handleData(dummyWorkflows, cfg.pattern);
      // console.log("sorted ", Object.keys(sorted));
      res.status(200).json(sorted);
      return;
    }

    const baseUrl = `https://${cfg.uachost}:${cfg.uacport}/`;
    const url = "uc/resources/task/listadv?type=Workflow";
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
        console.log("Got ", data.length);
        writeFileSync('../workflow.json', JSON.stringify(data));
        const sorted = handleData(data, cfg.pattern);
        console.log("sorted ", sorted.length);
        res.status(200).json(sorted);
      })
      .catch((error: any) => console.error(error));
  });



  function getEnv(req: any) {
    let env = "";
    try {
      env = req.query.uacenv;
    } catch (e) {
      env = uacenv;
    }
    console.log("getEnv: ", env);
    console.log(`${JSON.stringify(config.environments[env])}`);
    return env;
  }

  function readToken(uacenv: string) {
    try {
      const homeDir = homedir();
      const configFilePath = config.environments[uacenv].token;
      const filePath = configFilePath.replace(/^~(?=$|\/|\\)/, homeDir);
      return readFileSync(filePath, "utf-8");

    } catch (e) {
      console.error(e);
      exit(1);
    }
  }

}