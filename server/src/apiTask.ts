/*
  Handling of tasks and workflows

*/

import express, { Request, Response } from 'express';
import { mkdir, readFileSync, writeFileSync } from "fs";
import { fetchWorkflows, readTask, updateTask } from "./uacApi";
import { checkConfig, config } from "./apiConfig";
import { getParm, handleData } from './util';
import { WorkflowNode } from './interfaces';

let taskList: WorkflowNode[] = [];

export default function apiTask(app: express.Application) {

  app.get("/api/task", async (req: Request, res: Response) => {
    console.log('\n--- /api/task');

    const env = getParm(req, 'uacenv');
    const task = getParm(req, 'taskname');

    const response = await readTask(config.environments[env], task)
    if (!response.ok) {
      console.log("Read task response not ok ", response.statusText);

      let message = "";
      if (response.status === 404) {
        message = `Task ${task} findes ikke`;
      } else {
        message = response.statusText;
      }
      res.status(response.status || 500).json({
        message: "Fejl ved get task",
        detail: message
      })
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
    // }
  });

  interface ParamItem {
    task: string,
    count: number
  }
  app.put("/api/updatetask", async (req: Request, res: Response) => {
    console.log('\n--- /api/updatetask');
    const env = getParm(req, 'uacenv');

    console.log(req.body);
    const response = await updateTask(config.environments[env], req.body)
    if (!response.ok) {
      console.log("Update task response not ok ", response.statusText);
      res.status(response.status || 500).json({
        message: "Noget gik galt",
        detail: response.statusText || 'An error occurred',
      });
      return
    }
    // console.log(response);
    const task = { task: req.body.name, count: config.paramTimeout };
    const paramFile = `data/${env}_param.json`;
    try {
      const paramList: ParamItem[] = JSON.parse(readFileSync(paramFile, 'utf-8'));
      for (let i = 0; i < paramList.length; i++) {
        paramList[i].count--;
      }
      let index = paramList.findIndex(item => item.task === req.body.name);
      if (index !== -1) {
        paramList.splice(index, 1, task);
      } else {
        paramList.push(task);
      }

      console.log("Write paramfil");
      writeFileSync(paramFile, JSON.stringify(paramList.filter((param: any) => param.count > 0)));
      console.log("Done");
    } catch (err) {
      try {
        console.log("Ingen paramfil - lav en ny");
        writeFileSync(paramFile, JSON.stringify([task]));
      } catch (err) {
        console.log("Den fejlede");
        mkdir("data", (err) => {
          console.error("Fejl ved oprettelse af 'data'")
        });
        writeFileSync(paramFile, JSON.stringify([task]));
      };
    };

    const text = await response.text();
    console.log(text);
    res.status(response.status).json({ message: 'Task opdateret', detail: text });
  });

  app.get("/api/parameters", async (req: Request, res: Response) => {
    console.log('\n--- /api/parameters');

    try {
      checkConfig();
    } catch (error) {
      res.status(400).json(error);
      return;
    }
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];
    const paramFile = `data/${env}_param.json`;
    taskList = [];

    let paramList = [];
    try {
      console.log("Read ", paramFile);
      paramList = JSON.parse(readFileSync(paramFile, 'utf-8'));
    } catch (e) {
      console.log("Endnu ingen param.json fil");
      res.status(200).json(paramList);
      return;
    }
    console.log("paramList: ", paramList, paramList.length);
    for (const obj of paramList) {
      const response = await readTask(cfg, obj.task);
      if (response.ok) {
        const task = await response.json();

        const paramObj = {
          sysId: task.sysId,
          name: task.name,
          type: task.type,
          agent: task.agent,
          command: task.command,
          exitCodes: task.exitCodes,
          parameters: task.parameters
        }
        taskList.push(paramObj);
      } else {
        console.log("response: ", response);
      }
    }
    // console.log("returner tasklist ", taskList);
    res.status(200).json(taskList);
  });


  app.get("/api/listadv", async (req: Request, res: Response) => {
    console.log('\n--- /api/listadv');

    try {
      checkConfig();
    } catch (error) {
      res.status(400).json(error);
      return;
    }
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    const response = await fetchWorkflows(cfg, cfg.prefix)
    if (!response.ok) {
      let detail = "";
      if (response.status === 404) {
        detail = `Der er ingen workflows i ${env}`;
      } else {
        detail = response.statusText;
      }
      res.status(response.status || 500).json({
        message: "Fejl ved indlæsning af workflows",
        detail
      });
      return
    };
    const data = await response.json();
    const sorted = handleData(data);
    res.status(200).json(sorted);
  });
}