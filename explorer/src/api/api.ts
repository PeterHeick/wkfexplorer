/**
 * This module contains functions for making API requests to the backend server.
 * @module api
 */

import { config } from '@/store/config';

/**
 * The base URL for the API requests.
 */
const baseUrl = `http://localhost:8080/api/`;

/**
 * The default options for the API requests.
 */
const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Host: "localhost:8080",
    "Sec-Fetch-Site": "cross-site",
  },
};

/**
 * An object containing functions for making API requests.
 */
export const api = {

  /**
   * Gets the configuration data from the server.
   * @returns A Promise that resolves to the configuration data.
   */
  getConfig() {
    const url = 'config';
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Gets the version number of the server.
   * @returns A Promise that resolves to the version number.
   */
  getVersion() {
    const url = 'version';
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Gets the plan data for a given file from the server.
   * @param file - The name of the file to get the plan data for.
   * @returns A Promise that resolves to the plan data.
   */
  getPlan(file: string) {
    const env = config.uacenv.value;
    const url = `plan?plan=${file}&uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Gets the task data for a given task name from the server.
   * @param name - The name of the task to get the data for.
   * @returns A Promise that resolves to the task data.
   */
  getTask(name: string) {
    const env = config.uacenv.value;
    const url = `task?taskname=${name}&uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  /**
   * Updates the task data on the server.
   * @param body - The updated task data.
   * @returns A Promise that resolves to the updated task data.
   */
  updateTask(body: any) {
    const env = config.uacenv.value;
    const url = `updatetask?uacenv=${env}`;

    const updatedOptions = {
      ...options,
      method: "PUT",
      body: JSON.stringify(body)
    };

    return fetch(baseUrl + url, updatedOptions)
      .then((data) => {
        return data
      })
      .catch((error) => {
        console.log(error);
      });
  },

  /**
   * Gets the list of parameters from the server.
   * @returns A Promise that resolves to the list of parameters.
   */
  getParamList() {
    const env = config.uacenv.value;
    const url = `parameters?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  /**
   * Gets the list of missing parameters from the server.
   * @returns A Promise that resolves to the list of missing parameters.
   */
  getMissing() {
    const env = config.uacenv.value;
    const url = `missing?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  /**
   * Gets the list of all workflows from the server.
   * @returns A Promise that resolves to the list of all workflows.
   */
  getAllWorkflows() {
    const env = config.uacenv.value;
    const url = `listadv?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Updates the plan data on the server.
   * @returns A Promise that resolves to the updated plan data.
   */
  updatePlan() {
    const env = config.uacenv.value;
    const url = `plan?uacenv=${env}`;
    options.method = "PUT";
    return fetch(baseUrl + url, options)
  },

  /**
   * Gets the progress data from the server.
   * @returns A Promise that resolves to the progress data.
   */
  progress() {
    options.method = "GET";
    const url = "progress";
    return fetch(baseUrl + url, options)
  },

  /**
   * Deletes the plan data on the server.
   * @returns A Promise that resolves to the deleted plan data.
   */
  deletePlan() {
    const env = config.uacenv.value;
    const url = `plan?uacenv=${env}`;
    options.method = "DELETE";
    return fetch(baseUrl + url, options)
  },

  /**
   * Gets the plan directory data for a given directory from the server.
   * @param directory - The name of the directory to get the plan directory data for.
   * @returns A Promise that resolves to the plan directory data.
   */
  getPlandir(directory: string) {
    const env = config.uacenv.value;
    const url = `plandir/?directory=${directory}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Starts the editor for a given file on the server.
   * @param file - The name of the file to start the editor for.
   * @returns A Promise that resolves to the editor data.
   */
  startEditor(file: string) {
    const url = `editor/?fileName=${file}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Starts the explorer for a given directory on the server.
   * @param file - The name of the directory to start the explorer for.
   * @returns A Promise that resolves to the explorer data.
   */
  startExplorer(file: string) {
    const url = `explorer/?dirName=${file}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  /**
   * Deletes a file on the server.
   * @param file - The name of the file to delete.
   * @returns A Promise that resolves to the deleted file data.
   */
  delete(file: string) {
    const url = `delete/?fileName=${file}`;
    options.method = "DELETE";
    return fetch(baseUrl + url, options)
  },
}