import express, { Request, Response } from 'express';
import { createReadStream, existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import * as readline from 'readline';
import { createWorkflow, add_task_to_workflow, make_edge, deleteTask, remove_task_from_workflow } from "./uacApi";
import { handleData, sortPlan, getParm, getWkfByName } from "./util";
import { checkConfig, config } from "./apiConfig";
import { Environment, WorkflowNode } from './interfaces';
import { spawn } from 'child_process';

export function apiPlan(app: express.Application) {
  let numberOfNodes = 0;
  let numberOfNodesProcessed = 0;
  let workflows: WorkflowNode[] = [];
  // Plan handling

  app.get("/api/progress", (req, res) => {
    res.status(200).json({ pct: numberOfNodesProcessed / numberOfNodes * 100 });
  })

  app.get("/api/plan", (req: any, res: any) => {
    console.log('\n--- /api/plan');
    const env = getParm(req, 'uacenv');
    const plan = getParm(req, 'plan');

    try {
      checkConfig();
    } catch (error) {
      res.status(400).json(error);
      return;
    }

    // const planDir = config.environments[env].planDir;

    readFileAndParseWorkflow(`${plan}`)
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
          workflows = workflowItems as WorkflowNode[];
          const sorted = handleData(workflows);
          res.status(200).json({ ok: true, wkf: sorted });
        }
      })
      .catch((err: any) => {
        console.log('Plan ikke fundet ', plan, err);
        res.status(404).json({
          message: "Plan ikke fundet",
          detail: `Plan ${plan} blev ikke fundet`,
          status: 404,
          ok: false
        });
      })

  });

  app.delete("/api/plan", async (req, res) => {
    console.log("\n-- delete api/plan");
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    const topLevelNames: string[] = sortPlan(workflows);

    // console.log("topLevelNames1 ", topLevelNames);
    if (topLevelNames) {
      console.log("Delete new plan");
      try {
        await deletePlan(cfg, workflows, topLevelNames.reverse());
        res.status(200).json({ message: "ok", detail: "Plan slettet" });
        return;
      } catch (error: any) {
        console.log("Delete fejlet", error);
        res.status(error.status || 500).json(error);
        return;
      }
    }
    res.status(400).json({ message: "Ingen plan", detail: "Der er ikke loaded nogen plan" });
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

    try {
      checkConfig();
    } catch (error) {
      res.status(400).json(error);
      return;
    }

    // Slet gammel plan først, hvis der laves om på planen, ligger der muligvis
    // nogle workflows som ikke længere er i brug, derfor slettes først den game plan.

    await deleteOldPlan(cfg, env, workflows);

    const topLevelNames: string[] = sortPlan(workflows);

    if (topLevelNames) {
      try {
        await deletePlan(cfg, workflows, topLevelNames.reverse());
        // Gem plan, så vi kan slette den næste gang.
        try {
          writeFileSync(`data/${env}_plan.json`, JSON.stringify(topLevelNames));
        } catch (e: any) {
          res.status(500).json({
            message: "Fejl ved skrivning af plan",
            detail: `Fejl ved skrivning af data/${env}_plan.json, ${e.code}`
          });
        }
      } catch (error: any) {
        console.log("Delete fejlet", error);
        res.status(error.status || 500).json(error);
        return;
      }
    }

    // Opret ny plan
    numberOfNodesProcessed = 0;
    let wkfName = "";
    for (const wkf of topLevelNames.reverse()) {
      wkfName = `${cfg.prefix}_${wkf}_wkf`;
      let wkfResponse;
      try {
        wkfResponse = await createWorkflow(cfg, wkfName)
      } catch (error: any) {
        res.status(error.status).json(error);
        return;
      }
      if (!wkfResponse.ok) {
        console.log(wkfResponse);
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
      const vstepX = config.verticeStepX;
      const vstepY = config.verticeStepY;

      const vmax = config.windowSize;
      let x = vstart;
      let y = vstart;
      let sourceId = 0;
      let destId = 0;
      let firstNode = true;
      let oldWkfTask = "";
      // const planNodes = wkfData.getPlan();
      const wf = workflows.find(w => w.name === wkf);
      if (wf?.workflowVertices) {
        for (const vertice of wf.workflowVertices) {
          numberOfNodesProcessed++;
          const wkfTask = `${cfg.prefix}_${vertice.task.value}_wkf`;

          try {
            const response = await add_task_to_workflow(cfg, wkfTask, wkfName, x, y);
            if (!response.ok) {
              if (response.status === 400) {
                console.error(`task missing:  ${wkfTask}`)
                status.missing.add(wkfTask)
                continue;
              }
              if (response.status === 404) {
                console.error(`task missing:  ${wkfName}`)
                status.missing.add(wkfName)
                continue;
              }
              console.log("add task to workflow failed ", response.status, response);
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
          } catch (error: any) {
            res.status(error.status).json(error);
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
          x = x + vstepX;
          if (x > vmax) {
            x = vstart;
            y = y + vstepY;
          }
        }
      }
    }
    console.log("Created");
    console.log("status ", status);
    // writeFileSync(`data/${env}_missing.json`, JSON.stringify(Array.from(status.missing)));
    const returnStatus = {
      missing: Array.from(status.missing),
      text: "status"
    }
    res.status(201).json(returnStatus);
  })

  app.get("/api/editor", (req: any, res: any) => {
    console.log('\n--- /api/editor');
    const fileName = getParm(req, 'fileName');

    if (!existsSync(fileName)) {
      writeFileSync(fileName, '', 'utf8');
    }
    spawn(config.editor, [fileName], { detached: true, stdio: 'ignore' });
    res.status(201).json({});
  })


  app.get("/api/explorer", (req: any, res: any) => {
    console.log('\n--- /api/explorer');
    const dirName = getParm(req, 'dirName');

    spawn('explorer', [dirName], { detached: true, stdio: 'ignore' });
    res.status(201).json({});
  })

  app.get("/api/delete", (req: any, res: any) => {
    console.log('\n--- /api/delete');
    const fileName = getParm(req, 'fileName');

    try {
      unlinkSync('path_to_your_file');
      console.log('File deleted successfully');
      res.status(200).json({});
      return;
    } catch (err) {
      console.error('There was an error:', err);
      res.status(403).json({ "message": "Fejl ved sletning", "details": err });
      return;
    }
  })
}

const deleteOldPlan = async (cfg: Environment[string], env: string, workflows: WorkflowNode[]) => {
  let curWorkflows = [];
  try {
    curWorkflows = JSON.parse(readFileSync(`data/${env}_plan.json`, 'utf-8'));
    console.log("Delete current plan ", curWorkflows);
    try {
      await deletePlan(cfg, workflows, curWorkflows);
    } catch (error) {
      throw error;
    }
  } catch (err: any) {
    throw {
      message: "Fejl ved læsning af plan",
      detail: `Current plan data/${env}_plan.json findes ikke ${err.message}`,
    }
  }
}

async function deletePlan(cfg: Environment[string], workflows: WorkflowNode[], sortedPlan: string[]): Promise<void> {
  for (const name of sortedPlan) {
    const wf = getWkfByName(workflows, name);
    await deleteNode(cfg, wf);
  }
}

async function deleteNode(cfg: Environment[string], node: WorkflowNode): Promise<void> {
  const name = `${cfg.prefix}_${node.name}_wkf`;
  console.log("delete: ", name)
  const response = await deleteTask(cfg, name)
  if (response.ok) {
    return
  }
  if (response.status === 404) {
    // console.log("task findes ikke det er OK, så er vi færdige");
    return;
  }
  if (response.status === 403) {
    console.log("Task findes men må ikke slettes, fjern vertices istedet");
    if (node?.workflowVertices) {
      for (const item of node.workflowVertices) {
        const itemName = `${cfg.prefix}_${item.task.value}_wkf`;
        const rmResponse = await remove_task_from_workflow(cfg, itemName, name);
        if (!rmResponse.ok) {
          console.log("remove task from workflow failed ", rmResponse.status, rmResponse);
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

interface WorkflowResult {
  workflowItems: WorkflowNode[];
  count: number;
  ok: boolean;
}

async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowResult> {
  const fileStream = createReadStream(filePath, { encoding: 'utf-8' });

  // console.log('readFileAndParseWorkflow ', filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let count = 0;
  const workflowItems: WorkflowNode[] = [];
  let currentWorkflowItem: WorkflowNode | null = null;

  for await (const line of rl) {

    lineNumber++;
    if (line.trim().startsWith('#')) {
      continue;
    }
    // console.log(line);

    const taskLine = line.split('#')[0].trim();

    if (taskLine.trim().length === 0) {
      continue;
    }

    let groupName = "";
    let matched = taskLine.match(/^(.+):$/);
    if (matched) {
      groupName = matched[1];
    }

    const groupMember = taskLine.match(/^(\w+)$/);

    const test = groupName || groupMember;
    if (!test) {
      return ({ workflowItems: {} as WorkflowNode[], count: lineNumber, ok: false })
    }

    count++;
    if (groupName) {
      // console.log(wkfName);
      if (currentWorkflowItem) {
        workflowItems.push(currentWorkflowItem);
      }
      // console.log("groupName: ", groupName);
      currentWorkflowItem = {
        name: groupName,
        type: "taskWorkflow",
        workflowVertices: [],
      };
    } else if (currentWorkflowItem) {
      const item = {
        task: {
          value: taskLine.trim(),
        }
      };
      // console.log("item: ",item);
      if (item && currentWorkflowItem.workflowVertices) {
        currentWorkflowItem.workflowVertices.push(item);
      }
    }
  }

  if (currentWorkflowItem) {
    workflowItems.push(currentWorkflowItem);
  }

  return { workflowItems, count, ok: true };
}