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

    try {
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
    } catch (error: any) {
      res.status(error.status || 500).json(error);
    }
  });

  interface ParamItem {
    task: string,
    count: number
  }
  app.put("/api/updatetask", async (req: Request, res: Response) => {
    console.log('\n--- /api/updatetask');
    const env = getParm(req, 'uacenv');

    const wkfTask = req.body.name;
    try {
      console.log(`Env: ${config.environments[env]}`);
      const response = await readTask(config.environments[env], wkfTask);
      if (response.ok) {
        let task = await response.json();
        task.parameters = req.body.parameters;
        try {
          const response = await updateTask(config.environments[env], task)
          if (!response.ok) {
            console.log("Update task response not ok ", response.statusText);
            res.status(response.status || 500).json({
              message: "Noget gik galt",
              detail: response.statusText || 'An error occurred',
            });
            return
          }
          // console.log(response);
          updateParmfile(req.body.name, env);

          const text = await response.text();
          console.log(text);
          res.status(response.status).json({ message: 'Task opdateret', detail: text });
        } catch (error: any) {
          res.status(error.status || 500).json(error);
        }
      } else {
        if (response.status === 404) {
          console.log(`${wkfTask} findes ikke i UAC`)
          throw {
            message: `${wkfTask} findes ikke`,
            detail: `${wkfTask} findes ikke i UAC`
          };
        } else {
          console.log(`Fejl  i ${wkfTask} ${response.status}`);
          throw {
            message: `Fejl ved læsning af ${wkfTask}`,
            detail: `Fejlkode: ${response.status}`
          };
        }
      }
    } catch (error: any) {
      console.log(`Last catch Fejl ${wkfTask} ${JSON.stringify(error)}`);
      res.status(error.status || 500).json(error);
    }
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
    const paramFile = `${config.dataDir}/${env}_param.json`;
    taskList = [];

    let paramList = [];
    try {
      console.log("Read ", paramFile);
      paramList = JSON.parse(readFileSync(paramFile, 'latin1'));
    } catch (e) {
      console.log("Endnu ingen param.json fil");
      res.status(200).json(paramList);
      return;
    }
    console.log("paramList: ", paramList, paramList.length);
    for (const obj of paramList) {
      try {
        const response = await readTask(cfg, obj.task);
        if (response.ok) {
          const task = await response.json();

          const paramObj = {
            name: task.name,
            type: task.type,
            parameters: task.parameters,
          }
          taskList.push(paramObj);
        } else {
          if (response.status === 404) {
            console.log(`task listet i paramlist: ${obj.task} er slettet i UAC, (ikke noget problem)`);
          } else {
            console.log("response: ", response);
          }
        }
      } catch (error: any) {
        res.status(error.status || 500).json(error);
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
      console.log('\n--- checkConfig: /api/listadv error');

      res.status(400).json(error);
      return;
    }

    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    try {
      const response = await fetchWorkflows(cfg, cfg.prefix)
      if (!response.ok) {
        console.log("listadv: response not ok");
        let detail = "";
        if (response.status === 404) {
          console.log("listadv: Ingen workflows");
          detail = `Der er ingen workflows i ${env}`;
        } else {
          detail = response.statusText;
        }
        console.log("listadv: fejl 500");
        res.status(response.status || 500).json({
          message: "Fejl ved indlæsning af workflows",
          detail
        });
        return;
      };
      const data = await response.json();
      console.log(`Number of tasks: ${data.length}`);
      if (data.length === 0) {
        res.status(404).json({
          message: "Ingen workflows",
          detail: `Der findes ingen workflows i ${env}`
        });
        return;
      }
      const sorted = handleData(data);
      res.status(200).json(sorted);
    } catch (error: any) {
      console.log("listadv: catch ", error);
      res.status(error.status).json({
        message: error.message,
        detail: error.detail
      });
    }
  });

  function updateParmfile(name: string, env: string) {
    const task = { task: name, count: config.paramTimeout };
    const paramFile = `${config.dataDir}/${env}_param.json`;
    try {
      const paramList: ParamItem[] = JSON.parse(readFileSync(paramFile, 'latin1'));
      for (let i = 0; i < paramList.length; i++) {
        paramList[i].count--;
      }
      let index = paramList.findIndex(item => item.task === name);
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
        mkdir(config.dataDir, (err) => {
          console.error(`Fejl ved oprettelse af '${config.dataDir}'`);
        });
        writeFileSync(paramFile, JSON.stringify([task]));
      };
    };
  }
}
