/*
  Read config file

*/

import express, { Request, Response } from 'express';
import { Config } from './interfaces';
import { readFileSync } from 'fs';
import { deepMerge } from './util';
import { exit } from 'process';

export let config: Config = {} as Config;
export let localConfig: Config = {} as Config;

function readConfig() {
  let json;

  console.log("read global config");
  try {
    json = readFileSync("config.json", "utf-8");
    config = JSON.parse(json);
  } catch (e: any) {
    console.log("config.json missing ", e.message);
    if (e.code === "ENOENT") {
      throw {
        message: "Kan ikke finde config.json",
        detail: e.message,
      };
    }
    throw {
      message: "Fejl config.json",
      detail: e.message,
    };
  }

  console.log("read local config ", config.localConfig);
  try {
    json = readFileSync(config.localConfig, "utf-8");
    const localConfig = JSON.parse(json);
    deepMerge(config, localConfig);
  } catch (e: any) {
    console.log("Kan ikke læse local config.json ", e.message);
    if (e.code !== "ENOENT") {
      throw {
        message: "Fejl i local config.json",
        detail: e.message,
      };
    }
  }

  if (!config.environments.hasOwnProperty(config.default)) {
    throw {
      message: "Fejl config.default",
      detail: `${config.default} findes ikke`,
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

    try {
      readConfig();
      res.status(200).json(config);
    } catch (error) {
      res.status(400).json(error);
      console.error("Fejl i config.json - webserver stoppet");
      exit(1);
    }
  });
}

export function apiVersion(app: express.Application, version: string) {
  app.get("/api/version", (req: Request, res: Response) => {
    console.log('\n--- /');
    console.log(`\n--- Get version ${version}`);
    const obj = { version };
    try {
      res.status(200).json(obj);
    } catch (error) {
      res.status(400).json(error);
    }
  });

}