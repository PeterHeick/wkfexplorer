import { read, readFileSync } from "fs";
import { homedir } from "os";
import { Config, Environment, WorkflowNode } from "./interfaces";
import { readTask, deleteTask } from "./uacApi";

export function readToken(file: string) {
  try {
    const homeDir = homedir();
    const filePath = file.replace(/^~(?=$|\/|\\)/, homeDir);
    return readFileSync(filePath, "utf-8");

  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getWkfByName(workflowSet: WorkflowNode[], name: string): WorkflowNode {
  for (const wkfNode of workflowSet) {
    if (wkfNode.name == name) {
      return wkfNode;
    }
  }
  return {} as WorkflowNode;
}

export function getParm(request: any, parm: string) {
  let p = "";
  p = request.query[parm];
  console.log("getParm: ", p);
  return p;
}

export async function deletePlan(cfg: Environment[string], currentWorkflows: string[], prefix: string) {
  console.log("deletePlan: ", cfg, currentWorkflows, prefix)
  for (const wkf of currentWorkflows) {
    const wkfName = `${prefix}_${wkf}_wkf`;
    const readResponse = await readTask(cfg, wkfName)
    if (!readResponse.ok) {
      // 404 task findes - ok for slet
      if (readResponse.status != 404) {
        console.log(`Error read task: ${readResponse.status} ${readResponse.statusText}`);
        throw {
          status: readResponse.status,
          message: 'Læsning af task fejlet',
          detail: `Læsning af ${wkfName} er fejlet ${readResponse.status}  ${readResponse.statusText}`
        };
      }
    } else {
      const delResponse = await deleteTask(cfg, wkfName)
      if (!delResponse.ok) {
        console.log("await del not ok ", delResponse);
        throw {
          status: delResponse.status,
          message: 'Sletning af task fejlet',
          detail: `Sletning af ${wkfName} er fejlet`
        };
      }
    }
  }
  return true;
}