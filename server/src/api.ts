import express, { Request, Response } from 'express';

import history from "connect-history-api-fallback";
import path from "path";
import mime from "mime";
import cors from "cors";
import { getNewPlan, handleData } from './util';
import { Config } from './interfaces';
import { mkdir, readFileSync, write, writeFileSync } from "fs";
import { deletePlan, getParm, getWkfByName, readToken } from './apiUtil';
import readFileAndParseWorkflow from "./plan";
import { wkfData } from "./wkfData";
import { add_task_to_workflow, createWorkflow, deleteTask, fetchWorkflows, make_edge, readTask, updateTask } from "./uacApi";

const docRoot = "docRoot";

export default function api(app: express.Application) {
  let config: Config = {} as Config;
  let numberOfNodes = 0;
  let numberOfNodesProcessed = 0;

  const readConfig = (res: Response) => {
    console.log("read config");
    try {
      let json = readFileSync("config.json", "utf-8");
      console.log("read config ", json);
      config = JSON.parse(json);
      return true;
    } catch (e: any) {
      console.log("Fejl i json ", e.message);
      res.status(400).json(
        {
          message: "Fejl i config.json",
          detail: e.message,
        })
      return false;
    }
    console.log("read config slut");
  }

  app.use(history());
  app.use(cors());
  app.use(express.json());
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

    if (Object.keys(config).length > 0 || readConfig(res)) {
      console.log('\n--- /api/config læst');
      res.status(200).json(config);
    }

  });

  app.get("/api/task", async (req: Request, res: Response) => {
    console.log('\n--- /api/task');

    const env = getParm(req, 'uacenv');
    const task = getParm(req, 'taskname');

    // Til brug for linux, hvor jeg ikke har adgang til UAC
    /*
    if (wkfData.hasDummy()) {
      let wkfNode = getWkfByName(wkfData.getDummyTask(), task);
      console.log(wkfNode);
      if (Object.keys(wkfNode).length === 0) {
        console.log('end fejl til klient, task findes ikke');
        res.status(404).json({
          message: "Fejl ved get task",
          detail: "Task findes ikke",
        })
        return;
      }
      res.status(200).json(wkfNode);
    } else {
      */
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

  app.put("/api/updatetask", async (req: any, res: any) => {
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
    try {
      const paramList = JSON.parse(readFileSync("data/param.json", 'utf-8'));
      for (let i = 0; i < paramList.length; i++) {
        paramList[i].count--;
      }
      paramList.push({task: req.body.name, count: config.paramTimeout})
      writeFileSync("data/param.json", JSON.stringify(paramList.filter((param: any) => param.count > 0)));
    } catch (err) {
      try {
        writeFileSync("data/param.json", JSON.stringify([]));
      } catch (err) {
        mkdir("data", (err) => {
          console.error("Fejl ved oprettelse af 'data'")
        });
       };
    };

    const text = await response.text();
    console.log(text);
    res.status(response.status).json({ message: 'Task opdateret', detail: text });
  });

  app.get("/api/progress", (req, res) => {
    res.status(200).json({ pct: numberOfNodesProcessed / numberOfNodes * 100 });
  })

  app.get("/api/listadv", async (req: Request, res: Response) => {
    console.log('\n--- /api/listadv');

    if (!(Object.keys(config).length > 0 || readConfig(res))) {
      // Error handling in readConfig
      return
    }
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    /*
    if (wkfData?.workflows?.test && wkfData.workflows.test.length > 0) {
      const sorted = handleData(wkfData.getWorkflow("test"), cfg.prefix);
      console.log("sorted ", sorted.length);
      res.status(200).json(sorted);
      return;
    }
    */

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

  // Plan handling
  app.get("/api/plan", (req: any, res: any) => {
    console.log('\n--- /api/plan');
    const env = getParm(req, 'uacenv');
    const plan = getParm(req, 'plan');
    console.log(req.query);
    const planDir = config.environments[env].planDir;
    if (!(Object.keys(config).length > 0 || readConfig(res))) {
      return
    }

    readFileAndParseWorkflow(`${planDir}/${plan}`)
      .then((obj: any) => {
        // console.log(workflowItems);
        let { workflowItems, count, ok } = obj;
        if (!ok) {
          res.status(409).json({
            message: "Fejl plan fil",
            detail: `Der er en syntaks fejl i ${plan} linje ${count}`,
            status: 409,
            ok: false
          });
          return
        } else {
          numberOfNodes = count;
          wkfData.setPlan(workflowItems);
          const sorted = handleData(wkfData.getPlan());
          res.status(200).json({ ok: true, wkf: sorted });
        }
      })
      .catch(() => {
        console.log('Plan ikke fundet ', plan, planDir);
        res.status(404).json({
          message: "Plan ikke fundet",
          detail: `Plan ${plan} blev ikke fundet planen skal ligge i ${planDir}`,
          status: 404,
          ok: false
        });
      })

  });

  // Make new workflow
  app.put("/api/plan", async (req: Request, res: Response) => {
    console.log("\n-- put api/plan");
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];
    const status = {
      missing: new Set<string>(),
      text: "status"
    };

    if (!(Object.keys(config).length > 0 || readConfig(res))) {
      return
    }
    // Slet gammel plan først
    let curWkfNames: string[] = [];
    try {
      const curWkfNames = JSON.parse(readFileSync(`${cfg.prefix}_plan.json`, 'utf-8'));
    } catch (err: any) {
      console.log(`Current plan ${cfg.prefix}_plan findes ikke ${err.message}`);
      res.status(404).json({ message: 'Plan findes ikke', detail: `${cfg.prefix}_plan.json findes ikke, og det er jo mærkeligt når du lige har valgt den.` });
      return
    };
    try {
      await deletePlan(cfg, curWkfNames, cfg.prefix);
    } catch (error: any) {
      console.log("1. Delete fejlet", error);
      res.status(error.status).json(error);
      return;
    }

    const topLevelNames: string[] = getNewPlan();

    // console.log("topLevelNames1 ", topLevelNames);
    if (topLevelNames) {
      try {
        await deletePlan(cfg, topLevelNames.reverse(), cfg.prefix);
        writeFileSync(`${cfg.prefix}_plan.json`, JSON.stringify(topLevelNames));
      } catch (error: any) {
        console.log("2. Delete fejlet", error);
        res.status(error.status).json(error);
        return;
      }
    }
    // console.log("topLevelNames2 ", topLevelNames);

    // Opret ny plan
    for (const wkf of topLevelNames.reverse()) {
      const wkfName = `${cfg.prefix}_${wkf}_wkf`;
      console.log(wkfName);
      const wkfResponse = await createWorkflow(cfg, wkfName)
      if (!wkfResponse.ok) {
        console.log("createTask failed");
        res.status(wkfResponse.status).json({
          message: 'Opret plan fejlet',
          detail: wkfResponse.statusText
        });
        return
      }
      console.log("Progress ", numberOfNodesProcessed, numberOfNodes);
      numberOfNodesProcessed++;

      const vstart = config.verticeStart;
      const vstep = config.verticeStep;
      const vmax = config.windowSize;
      let x = vstart;
      let y = vstart;
      let sourceId = 0;
      let destId = 0;
      let firstNode = true;
      let oldWkfTask = "";
      const planNodes = wkfData.getPlan();
      const wf = planNodes.find(w => w.name === wkf);
      if (wf?.workflowVertices) {
        for (const vertice of wf.workflowVertices) {
          numberOfNodesProcessed++;
          const wkfTask = `${cfg.prefix}_${vertice.task.value}_wkf`;
          console.log("  ", wkfTask);
          const response =
            await add_task_to_workflow(cfg, wkfTask, wkfName, x, y);
          if (!response.ok) {
            if (response.status === 400) {
              console.error(`task missing:  ${wkfTask}`)
              status.missing.add(wkfTask)
              continue;
            }
            console.log("add task to workflow failed ", response.status);
            res.status(response.status).json({
              message: 'Tilføj task fejlet',
              detail: `Tilføj ${wkfTask} til ${wkfName} fejlet: ${response.statusText}`
            });
            return;
          } else {
            const vertex = await response.json();
            // console.log("vertex ", vertex);
            destId = vertex.vertexId;
          }
          // console.log("destId ", destId);
          if (!firstNode) {
            const response = await make_edge(cfg, wkfName, sourceId, destId);
            if (!response.ok) {
              console.log("make edge add task failed ", response.statusText, response.status);
              res.status(response.status).json({
                message: 'Tilføj afhængighed fejlet',
                detail: `Tilføj pil fra ${oldWkfTask} til ${wkfTask} fejlet: ${response.statusText}`
              });
              return;
            }
          }
          sourceId = destId;
          firstNode = false;
          oldWkfTask = wkfTask;
          x = x + vstep;
          if (x > vmax) {
            x = vstart;
            y = y + vstep;
          }
        }
      }
    }
    console.log("Created");
    console.log("status ", status);
    const returnStatus = {
      missing: Array.from(status.missing),
      text: "status"
    }
    res.status(201).json(returnStatus);
  })

  /*
  let json = readFileSync("config.json", "utf-8");
  config = JSON.parse(json);
  */
}