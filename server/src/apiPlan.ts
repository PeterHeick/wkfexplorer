import express, { Request, Response } from 'express';
import { createReadStream, existsSync, mkdir, readFileSync, unlinkSync, writeFileSync } from "fs";
import * as readline from 'readline';
import { createWorkflow, add_task_to_workflow, make_edge, deleteTask, remove_task_from_workflow, updateTask, readTask } from "./uacApi";
import { handleData, sortPlan, getParm, getWkfByName, fixDates } from "./util";
import { checkConfig, config } from "./apiConfig";
import { Environment, ParmItem, WorkflowNode, WorkflowResult } from './interfaces';
import { spawn } from 'child_process';
import path from 'path';

export function apiPlan(app: express.Application) {
  let numberOfNodes = 0;
  let numberOfNodesProcessed = 0;
  const currentPlan: {
    workflows: WorkflowNode[];
    parmItems: ParmItem[];
  } = {
    workflows: [],
    parmItems: []
  }
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

    readFileAndParseWorkflow(`${plan}`)
      .then((obj: any) => {
        let { workflowItems, parmItems, count, ok } = obj;
        console.log(`obj.parms: ${parmItems}`)

        if (!ok) {
          res.status(400).json({
            message: "Fejl i plan fil",
            detail: `Der er en syntaks fejl i ${path.basename(plan)} linje ${count}`,
          });
          return
        } else {
          numberOfNodes = count;
          currentPlan.workflows = workflowItems as WorkflowNode[];
          const sorted = handleData(currentPlan.workflows);
          currentPlan.parmItems = parmItems;
          res.status(200).json({ ok: true, wkf: sorted });
        }
      })
      .catch((err: any) => {
        console.log('Fejl ved plan ', plan, err);
        res.status(404).json({
          message: "Plan ikke fundet",
          detail: `Plan ${path.basename(plan)} blev ikke fundet`,
        });
      })

  });

  app.delete("/api/plan", async (req, res) => {
    console.log("\n-- delete api/plan");
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];

    const topLevelNames: string[] = sortPlan(currentPlan.workflows);

    // console.log("topLevelNames1 ", topLevelNames);
    if (topLevelNames) {
      console.log("Delete new plan");
      try {
        await deletePlan(cfg, currentPlan.workflows, topLevelNames.reverse());
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
  interface Istatus {
    missing: Set<string>;
    text: "status";
  }

  app.put("/api/plan", async (req: Request, res: Response) => {
    console.log("\n-- put api/plan");
    const env = getParm(req, 'uacenv');
    const cfg = config.environments[env];
    const status: Istatus = {
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

    await deleteOldPlan(cfg, env, currentPlan.workflows)
      .catch((error) => {
        // Det gør ikke noget at den gamle plan ikke kan slettes
        if (error.code === 'ENOENT') {
          console.log(`no such file or directory: ${error.path}`);
        } else {
          console.log(error);
        }
      })

    const topLevelNames: string[] = sortPlan(currentPlan.workflows);

    if (topLevelNames) {
      try {
        await deletePlan(cfg, currentPlan.workflows, topLevelNames.reverse());
        // Gem plan, så vi kan slette den næste gang.
        try {
          writeFileSync(`${config.dataDir}/${env}_plan.json`, JSON.stringify(topLevelNames));
        } catch (e: any) {
          mkdir(config.dataDir, (err) => {
            console.error(`Fejl ved oprettelse af '${config.dataDir}'`)
          });
          try {
            writeFileSync(`${config.dataDir}/${env}_plan.json`, JSON.stringify(topLevelNames));
          } catch (e: any) {
            res.status(500).json({
              message: "Fejl ved skrivning af plan",
              detail: `Fejl ved skrivning af ${config.dataDir}/${env}_plan.json, ${e.code}`
            });
          }
        }
      } catch (error: any) {
        console.log("Delete fejlet", error);
        res.status(error.status || 500).json(error);
        return;
      }
    }

    try {
      await createNewPlan(res, cfg, topLevelNames, status);
    } catch (error: any) {
      res.status(error.status).json(error);
      return;
    }

    try {
      await handleParmItems(cfg, currentPlan.parmItems);
    } catch (error) {
      res.status(400).json(error);
      return;
    }

    console.log("Created");
    console.log("status ", status);
    // writeFileSync(`${config.dataDir}/${env}_missing.json`, JSON.stringify(Array.from(status.missing)));
    const returnStatus = {
      missing: Array.from(status.missing),
      text: "status"
    }
    res.status(201).json(returnStatus);
  })

  async function handleParmItems(cfg: Environment[string], items: ParmItem[]) {
    console.log(`handleParmItems() items ${JSON.stringify(items)}`);
    for (const item of items) {
      const wkfTask = `${cfg.prefix}_${item.task}`;
      console.log(`handleParms() Task: ${wkfTask}`);
      try {
        const response = await readTask(cfg, wkfTask);
        if (response.ok) {
          const task = await response.json();
          task.parameters = item.parameter;
          const res = await updateTask(cfg, task)
          if (!res.ok) {
            console.log(`Update task response not ok Status: ${res.status}  ${JSON.stringify(res)}`);
            throw {
              message: "Noget gik galt",
              detail: res.statusText || 'An error occurred',
            };
          } else {
            console.log("Update succeed");
          }
        } else {
          if (response.status === 404) {
            console.log(`Task listet i plan: ${wkfTask} findes ikke i UAC`)
            throw {
              message: `${item} findes ikke`,
              detail: `Task listet i plan: ${wkfTask} findes ikke i UAC`
            };
          } else {
            console.log(`Fejl  i ${wkfTask} ${response.status}`);
            throw {
              message: `Fejl ved læsning af ${item}`,
              detail: `Fejlkode: ${response.status}`
            };
          }
        }
      } catch (error: any) {
        console.log(`Last catch Fejl ${wkfTask} ${JSON.stringify(error)}`);
        throw error;
      }
    }
  }

  async function createNewPlan(res: Response, cfg: Environment[string], topLevelNames: string[], status: Istatus) {
    // Opret ny plan
    console.log("createNewPlan");
    numberOfNodesProcessed = 0;
    let vertexMap: { [key: string]: { [key: string]: any } } = {};
    let wkfName = "";
    for (const wkf of topLevelNames.reverse()) {
      wkfName = `${cfg.prefix}_${wkf}_wkf`;
      let wkfResponse;
      try {
        wkfResponse = await createWorkflow(cfg, wkfName)
      } catch (error: any) {
        res.status(error.status).json(error);
        throw {
          message: "Fejl ved create plan",
          detail: `${error}`,
          status: error.status
        }
      }
      if (!wkfResponse.ok) {
        console.log(wkfResponse);
        console.log("createTask failed");
        throw {
          message: "Fejl ved create plan",
          detail: wkfResponse.statusText,
          status: wkfResponse.status
        }
      }

      console.log("Progress ", numberOfNodesProcessed, numberOfNodes);
      numberOfNodesProcessed++;

      const vstart = config.verticeStart;
      const vstepX = config.verticeStepX;
      const vstepY = config.verticeStepY;
      let yCounted = false;

      const vmax = config.windowSize;
      let x = vstart;
      let y = vstart;
      let sourceId = 0;
      let destId = 0;
      let firstNode = true;
      let oldWkfTask = "";
      // const planNodes = wkfData.getPlan();
      const wf = currentPlan.workflows.find(w => w.name === wkf);
      if (wf?.workflowVertices) {
        for (const vertice of wf.workflowVertices) {
          numberOfNodesProcessed++;
          const wkfTask = `${cfg.prefix}_${vertice.task.value}_wkf`;

          if (vertice.dependant != "") {
            const depTask = `${cfg.prefix}_${vertice.dependant}_wkf`;
            x = Math.max(vertexMap[depTask].x - vstepX, vstart);
            if (!yCounted) {
              y = y + vstepY;
            }
          }
          yCounted = false;
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
            throw {
              message: 'Tilføj task fejlet',
              detail: `Tilføj ${wkfTask} til ${wkfName} fejlet: ${response.statusText}`,
              status: response.status
            }
          } else {
            const vertex = await response.json();
            // console.log("vertex ", vertex);
            destId = vertex.vertexId;
            vertexMap[wkfTask] = { destId, x };
          }

          // console.log("destId ", destId);
          console.log(`vertice ${JSON.stringify(vertice)}`);
          if (vertice.dependant != "") {
            const depTask = `${cfg.prefix}_${vertice.dependant}_wkf`;
            console.log(`  depTask: ${depTask}`);
            let sId = destId;
            console.log(`vertexMap ${JSON.stringify(vertexMap)}`);
            let dId = vertexMap[depTask].destId;
            if (!dId) {
              throw {
                message: `Fejl ved oprettelse af afhængighed`,
                detail: `"${depTask}" findes ikke, den skal angives i ${wkfName} før ${wkfTask}`,
                status: 400
              }
            }
            const resp = await make_edge(cfg, wkfName, sId, dId, vertice.dependant === "");
            if (!resp.ok) {
              console.log("make edge add task failed ", resp.statusText, resp.status);
              throw {
                message: 'Tilføj afhængighed fejlet',
                detail: `Tilføj pil fra ${oldWkfTask} til ${wkfTask} fejlet: ${resp.statusText}`,
                status: resp.status
              }
            }
            x = vmax + 1;

          } else {
            if (!firstNode) {
              const response = await make_edge(cfg, wkfName, sourceId, destId, vertice.dependant === "");
              if (!response.ok) {
                console.log("make edge add task failed ", response.statusText, response.status);
                throw {
                  message: 'Tilføj afhængighed fejlet',
                  detail: `Tilføj pil fra ${oldWkfTask} til ${wkfTask} fejlet: ${response.statusText}`,
                  status: response.status
                }
              }
            }
            sourceId = destId;
            firstNode = false;
            oldWkfTask = wkfTask;
          }
          x = x + vstepX;
          if (x > vmax) {
            x = vstart;
            y = y + vstepY;
            yCounted = true;
          }
        }
      }
    }
  }
}

const deleteOldPlan = async (cfg: Environment[string], env: string, workflows: WorkflowNode[]) => {
  let curWorkflows = [];
  console.log(`deleteOldPlan: ${config.dataDir}/${env}_plan.json`);
  curWorkflows = JSON.parse(readFileSync(`${config.dataDir}/${env}_plan.json`, 'utf-8'));
  await deletePlan(cfg, workflows, curWorkflows);
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

async function readFileAndParseWorkflow(filePath: string): Promise<WorkflowResult> {
  const fileStream = createReadStream(filePath, { encoding: 'utf-8' });

  console.log('readFileAndParseWorkflow ', filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  let count = 0;
  const workflowItems: WorkflowNode[] = [];
  const parmItems: ParmItem[] = [];
  let currentWorkflowItem: WorkflowNode | null = null;

  for await (const line of rl) {

    lineNumber++;
    if (line.trim().startsWith('#')) {
      continue;
    }

    let taskLine = line.split('#')[0].trim();
    if (taskLine.trim().length === 0) {
      continue;
    }

    console.log(`Read taskline: ${taskLine}`);
    const result = parseLine(taskLine);

    if (!result.ok) {
      return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
    }
    console.log(`result: ${JSON.stringify(result)}`);

    count++;
    if (result.parmMatched) {
      handleParm(parmItems, result.parmItem);
    } else if (result.groupNameMatched) {
      currentWorkflowItem = handleGroup(currentWorkflowItem, workflowItems, result.groupName);
    } else if (currentWorkflowItem) {
      handleWorkflowItem(currentWorkflowItem, result.groupMember, result.dependant);
    } else {
      console.log(`No match ${result.parmMatched}`);
      return ({ workflowItems: {} as WorkflowNode[], parmItems: [], count: lineNumber, ok: false })
    }
  }

  if (currentWorkflowItem) {
    workflowItems.push(currentWorkflowItem);
  }
  console.log(`readAndFParseWorkflow Parm Items ${JSON.stringify(parmItems)}`);
  return { workflowItems, parmItems, count, ok: true };
}

function handleParm(parmItems: ParmItem[], parmItem: ParmItem) {
  if (Object.keys(parmItem).length > 0) {
    parmItems.push(parmItem)
  }
}

function handleWorkflowItem(currentWorkflowItem: WorkflowNode, groupMember: string, dependant: string) {
  console.log("handleWorkflowItem()");
  const item = {
    task: {
      value: groupMember.trim()
    },
    dependant
  };
  if (item && currentWorkflowItem.workflowVertices) {
    currentWorkflowItem.workflowVertices.push(item);
  }
}

function handleGroup(currentWorkflowItem: WorkflowNode | null, workflowItems: WorkflowNode[], groupName: string) {
  console.log(`Add group: ${groupName}`);
  if (currentWorkflowItem) {
    console.log(`Add group member: ${currentWorkflowItem.name}`);
    workflowItems.push(currentWorkflowItem);
  }
  // console.log("groupName: ", groupName);
  currentWorkflowItem = {
    name: groupName,
    type: "taskWorkflow",
    workflowVertices: [],
  };
  console.log(`Create currentWorkflowItem: ${currentWorkflowItem.name}`);
  return currentWorkflowItem;
}

function parseLine(line: string) {

  console.log("parseLine()");
  console.log("Try groupName");
  let groupName = "";
  const groupNameMatched = line.match(/^([\wæøåÆØÅ]+):$/);
  if (groupNameMatched) {
    console.log("groupName matched");
    groupName = groupNameMatched[1];
    console.log("  ", groupName);
  }
  console.log(groupNameMatched);

  console.log("Try groupMember");
  let groupMember = "";
  const groupMemberMatched = line.match(/^([\wæøåÆØÅ]+)$/);
  if (groupMemberMatched) {
    console.log("groupMember matched");
    groupMember = groupMemberMatched[1];
    console.log("  ", groupMember);
    console.log("  ", groupMemberMatched);
  }
  console.log(groupMemberMatched);

  console.log("Try groupMember + dependant");
  let dependant = ""
  const dependanceMatched = line.match(/^([\wæøåÆØÅ]+) *-> *([\wæøåÆØÅ]+)$/);
  if (dependanceMatched) {
    console.log("groupMember dependancy matched");
    groupMember = dependanceMatched[1];
    dependant = dependanceMatched[2];
    console.log(dependanceMatched);
    console.log(`  groupMember ${groupMember}, dependant ${dependant}`);
  }
  console.log(dependanceMatched);

  let parmItem = { task: "", parameter: "" };
  const parmMatched = line.match(/^([\wæøåÆØÅ]+) *= *(.*)$/);
  if (parmMatched) {
    console.log("Parm matched");
    const task = parmMatched[1].trim();
    const parameter = parmMatched[2].trim();
    parmItem = { task, parameter };
  }
  console.log(parmMatched);

  const ok = groupNameMatched || groupMemberMatched || dependanceMatched || parmMatched;
  return { ok, groupNameMatched, groupMemberMatched, dependanceMatched, parmMatched, groupName, groupMember, dependant, parmItem, }
}
