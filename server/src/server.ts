import express from "express";
import { homedir } from "os";
import { exit } from "process";
import { readFileSync, writeFileSync } from "fs";
import { UacConfig, IuserConfig, WorkflowNode } from './interfaces';
import api from "./api";

// const data: Idata = {} as Idata;
var dummyWorkflows: WorkflowNode[];
var config: UacConfig = {} as UacConfig;
var uacenv = "";
var token = "";

// Dummy data
try {
  dummyWorkflows = JSON.parse(readFileSync("uac.json", "utf-8"));
} catch (e) {
  dummyWorkflows = [];
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
try {
  const homeDir = homedir();
  const configFilePath = config.environments[uacenv].token;
  const filePath = configFilePath.replace(/^~(?=$|\/|\\)/, homeDir);
  token = readFileSync(filePath, "utf-8");
} catch (e) {
  console.error(e);
  exit(1);
}

export const app = express();
api(app, config, token, uacenv, dummyWorkflows);

// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});

