import express from "express";
import { exit } from "process";
import { readFileSync } from "fs";
import { Config } from './interfaces';
import api from "./api";

// const data: Idata = {} as Idata;

var config: Config = {} as Config;
var uacenv = "";

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

export const app = express();
api(app, config);

// start serveren
app.listen(8080, () => {
  console.log(process.cwd());
  console.log("Server kører på http://localhost:8080/");
});


