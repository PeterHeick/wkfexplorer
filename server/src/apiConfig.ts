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

/**
 * Reads the configuration from the config.json file and merges it with the local config file.
 * @throws {Object} Throws an object with a message and detail property if there is an error reading the config files.
 */
function readConfig() {
  let json;

  console.log("  read global config");
  try {
    json = readFileSync("config.json", "utf-8");
    config = JSON.parse(json);
  } catch (e: any) {
    console.log("  config.json missing ", e.message);
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

  console.log("  read local config ", config.localConfig);
  try {
    json = readFileSync(config.localConfig, "utf-8");
    const localConfig = JSON.parse(json);
    deepMerge(config, localConfig);
  } catch (e: any) {
    console.log("  Kan ikke læse local config.json ", e.message);
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

/**
 * Checks if the `config` object is defined and not empty. If it is empty, it reads the configuration from file.
 */
export function checkConfig() {
  if (!config || (Object.keys(config).length === 0)) {
    readConfig();
  }
}

/**
 * Configures the API endpoint for retrieving the application configuration.
 * @param app - The express application instance.
 */
export function apiConfig(app: express.Application) {
  app.get("/api/config", (req: any, res: any) => {
    console.log('\n--- /api/config');

    try {
      readConfig();
      res.status(200).json(config);
    } catch (error) {
      res.status(400).json(error);
      console.error("  Fejl i config.json - webserver stoppet");
      exit(1);
    }
  });
}

/**
 * Registers an API version endpoint on the given Express application.
 * @param app - The Express application to register the endpoint on.
 * @param version - The version string to include in the response.
 */
export function apiVersion(app: express.Application, version: string) {
  app.get("/api/version", (req: Request, res: Response) => {
    console.log(`\n--- api/version ${version}`);
    const obj = { version };
    try {
      res.status(200).json(obj);
    } catch (error) {
      res.status(400).json(error);
    }
  });

}