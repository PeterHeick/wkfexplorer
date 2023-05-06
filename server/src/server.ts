import express from "express";
import { homedir } from "os";
import { exit } from "process";
import { readFileSync, writeFileSync } from "fs";
import { UacConfig, WorkflowNode } from './interfaces';
import api from "./api";

// const data: Idata = {} as Idata;
var dummyWorkflows: WorkflowNode[];
var dummyTasks: WorkflowNode[];
var config: UacConfig = {} as UacConfig;
var uacenv = "";
var token = "";

// Dummy data
try {
  dummyWorkflows = JSON.parse(readFileSync("../workflows.json", "utf-8"));
  dummyTasks = JSON.parse(readFileSync("../tasks.json", "utf-8"));
  //let tmp = dummyWorkflows.filter((x) => x.type != "taskWorkflow")
  //writeFileSync("../tasks.json", JSON.stringify(tmp));
} catch (e) {
  dummyWorkflows = [];
  dummyTasks = [];
}

// Read Config file
try {
  let json = readFileSync("config.json", "utf-8");
  config = JSON.parse(json);
} catch (e) {
  console.error("Reading Config ", e);
  exit(1);
}

// Default environment
uacenv = config.default;
readToken(uacenv);

export const app = express();
api(app, config, token, uacenv, dummyWorkflows, dummyTasks);

// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});

function readToken(uacenv: string) {
  try {
    const homeDir = homedir();
    const configFilePath = config.environments[uacenv].token;
    const filePath = configFilePath.replace(/^~(?=$|\/|\\)/, homeDir);
    token = readFileSync(filePath, "utf-8");
  } catch (e) {
    console.error(e);
    exit(1);
  }
}

