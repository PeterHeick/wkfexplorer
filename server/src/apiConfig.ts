/*
  Read config file

*/

import express, { Request, Response } from 'express';
import { Config } from './interfaces';
import { readFileSync } from 'fs';
import { deepMerge } from './util';

export let config: Config = {} as Config;
export let localConfig: Config = {} as Config;

function readConfig() {
  console.log("read config");
  try {
    let json = readFileSync("config.json", "utf-8");
    config = JSON.parse(json);

    try {
      console.log("read local config ", config.localConfig);
      json = readFileSync(config.localConfig, "utf-8");
      const localConfig = JSON.parse(json);
      deepMerge(config, localConfig);
    } catch (e: any) {
      console.log("Kan ikke læse local json ", e, e.message);
      if (e.code !== "ENOENT") {
        throw {
          message: "Fejl i local config.json",
          detail: e.message,
        };
      }
    }
  } catch (e: any) {
    console.log("Fejl i json ", e.message);
    throw {
      message: "Fejl i global config.json",
      detail: e.message,
    };
  }
}

export function checkConfig() {
  console.log("checkConfig: ");
  console.log(Object.keys(config).length);
  if (!config || (Object.keys(config).length === 0)) {
    readConfig();
  }
}

export function apiConfig(app: express.Application) {
  app.get("/api/config", (req: any, res: any) => {
    console.log('\n--- /api/config');

    //if (Object.keys(config).length > 0 || readConfig(res)) {
    try {
      readConfig();
      res.status(200).json(config);
    } catch (error) {
      res.status(400).json(error);
    }
  });
}