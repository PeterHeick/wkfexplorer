import { readFileSync } from "fs";
import { WorkflowNode } from "./interfaces";

type Workflows = { [key: string]: WorkflowNode[] };
class Global {

  // Der er workflows for hvert environment
  workflows: Workflows = {};
  // Der er kun een plan i spil ad gangen
  plan: WorkflowNode[] = [];
  dummyWorkflow: WorkflowNode[] = {} as WorkflowNode[];
  dummyTasks: WorkflowNode[] = {} as WorkflowNode[];

  setWorkflow(data: WorkflowNode[], env: string): void {
    this.workflows[env] = data;
  }

  getWorkflow(env: string): WorkflowNode[] {
    return this.workflows[env];
  }

  hasEnv(env: string): boolean {
    return this.workflows.hasOwnProperty(env) && this.workflows[env].length > 0;
  }

  setPlan(plan: WorkflowNode[]) {
    this.plan = plan;
  }

  getPlan(): WorkflowNode[] {
    return this.plan;
  }

  getDummyWorkflow(env: string): WorkflowNode[] {
    console.log("getDummyWorkflow");
    return this.dummyWorkflow;
  }

  getDummyTask(): WorkflowNode[] {
    console.log("getDummyTask");
    return this.dummyTasks;
  }

  hasDummy() {
    console.log("hasDummy", this.dummyTasks.length > 0)
    return this.dummyTasks.length > 0
  }

  constructor() {
    // Dummy data
    try {
      this.workflows.test = JSON.parse(readFileSync("../workflows.json", "utf-8"));
      this.workflows.ussand = this.workflows.test;
      this.dummyTasks = JSON.parse(readFileSync("../tasks.json", "utf-8"));
    } catch (e) {
      this.dummyTasks = [];
    }
  }
}

export const global = new Global();