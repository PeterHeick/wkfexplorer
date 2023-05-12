import { Environment } from '../types/interfaces';

const baseUrl = `http://localhost:8080/api/`;
const headers = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Host: "localhost:8080",
    "Sec-Fetch-Site": "cross-site",
  },
};

export const api = {

  getConfigData() {
    console.log("api.getConfigData ")
    const url = 'config';
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        console.log("api.getConfigData length: ", Object.keys(data.environments).length);
        return data;
      })
  },

  getPlanData() {
    console.log("api.getPlanData ")
    const url = 'plan?plan=ugeplan.txt';
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        console.log("api.getPlanData length: ", Object.keys(data).length);
        return data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      })
  },

  // Kaldt fra handleTaskClick i TreeComponent
  getTask(name: string, env: string) {
    console.log("api.getTask", name);
    return new Promise((resolve, reject) => {
      if (name === undefined) {
        reject('Name undefined');
      } else {
        const url = `task?taskname=${name}&uacenv=${env}`;
        return fetch(baseUrl + url, headers)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.log(error);
            return [];
          })
      }
    })
  },

  // env eks: "usprod"
  // kaldes fra workflowStore
  getAllWorkflows(env: string) {
    console.log("api.getAllWorkflows ", env);
    const url = `listadv?uacenv=${env}`;
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }
}