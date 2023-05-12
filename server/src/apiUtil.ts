import { readFileSync } from "fs";
import { homedir } from "os";
import { WorkflowNode } from "./interfaces";

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
  console.log("getEnv: ", p);
  return p;
}
