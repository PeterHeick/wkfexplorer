import express, { Request, Response } from 'express';

import history from "connect-history-api-fallback";
import path from "path";
import mime from "mime";
import cors from "cors";
import { handleData } from './util';
import { Config, WorkflowNode } from "./interfaces";
import { readFileSync } from "fs";
import { getParm, getWkfByName, readToken } from './apiUtil';
import readFileAndParseWorkflow from "./weekplan";
import { global } from "./global";
import { fetchTask, fetchWorkflows } from "./uacApi";

const docRoot = "docRoot";

export default function api(app: express.Application) {
  let config: Config = {} as Config;

  app.use(history());
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

  app.get("/api/config", (req: any, res: any) => {
    console.log('\n--- /api/config');
    try {
      let json = readFileSync("config.json", "utf-8");
      config = JSON.parse(json);
    } catch (e) {
      res.status(405).send("Reading Config ", e);
    }
    res.status(200).json(config);
  });

  app.get("/api/plan", (req: any, res: any) => {
    console.log('\n--- /api/weekplan');
    const plan = getParm(req, 'plan');

    readFileAndParseWorkflow(plan)
      .then((workflowItems) => {
        console.log(JSON.stringify(workflowItems, null, 2))
        global.setPlan(workflowItems);
      })
      .catch(() => {
        console.log('Plan ikke fundet ugeplan', plan);
      })

    const sorted = handleData(global.getPlan(), ".*");
    console.log("sorted ", sorted.length);
    res.status(200).json(sorted);
  });

  app.get("/api/task", (req: Request, res: Response) => {
    console.log('\n--- /api/task');

    const env = getParm(req, 'uacenv');
    const task = getParm(req, 'taskname');

    if (global.hasDummy()) {
      let wkfNode = getWkfByName(global.getDummyTask(), task);
      res.status(200).json(wkfNode);
    } else {
      fetchTask(res, config.environments[env], task);
    }
  });

  app.get("/api/listadv", (req: any, res: any) => {
    console.log('\n--- /api/listadv');

    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    if (global.hasEnv(env)) {
      const sorted = handleData(global.getWorkflow(env), cfg.pattern);
      console.log("sorted ", Object.keys(sorted));
      res.status(200).json(sorted);
      return;
    }

    const pattern = cfg.pattern.replace(/\.\*/, '*');
    fetchWorkflows(res, cfg, env, pattern) 
  });

  /*
  var workflows: { [key: string]: WorkflowNode[] } = {};
  var weekplan: WorkflowNode[] = {} as WorkflowNode[];
  var dummyTasks: WorkflowNode[];

  // Dummy data
  try {
    workflows.test = JSON.parse(readFileSync("../workflows.json", "utf-8"));
    workflows.ussand = workflows.test;
    dummyTasks = JSON.parse(readFileSync("../tasks.json", "utf-8"));
  } catch (e) {
    dummyTasks = [];
  }
  */

}