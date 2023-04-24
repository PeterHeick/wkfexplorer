import express from "express";
import os from "os";
import { exit } from "process";
import { readFileSync, writeFileSync } from "fs";
import { Iconfig, IuserConfig, WorkflowNode, Idata } from './interfaces';
import init_app from "./init_app";

const docRoot = "docRoot";

// var sys: 'prod' | 'test' = 'test';
var baseUrl: string;

var data:  Idata = {
  uac: [],
  globalUacConfig: {},
  userUacConfig: { uacenv: "", token: { prod: "", test: ""}},
  uacenv: "",
};

// Data dummy
try {
  data.uac = JSON.parse(readFileSync("uac.json", "utf-8"));
} catch (e) {
  console.error(e);
  data.uac = [];
}

// Read Config file
try {
  let json;
  json = readFileSync("config.json", "utf-8");
  data.globalUacConfig = JSON.parse(json);
  console.log("Global Config :", json);

} catch (e) {
  console.error(e);
  data.globalUacConfig = {}
}

try {
  let json = readFileSync("H:/uac/config.json", "utf-8");
  data.userUacConfig = JSON.parse(json);
  data.uacenv = data.userUacConfig.uacenv;
  console.log("lokal config: ", json);
} catch (e) {
  try {
    let json = readFileSync(`${os.homedir()}/.uac/config.json`, "utf-8");
    data.userUacConfig = JSON.parse(json);
    data.uacenv = data.userUacConfig.uacenv;
    console.log("lokal config: ", json);
  } catch (e) {
    console.error(e);
    exit(1);
  }
}


export const app = express();

init_app(app, data);
// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});

