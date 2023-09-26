import { config } from '@/store/config';
import Swal from 'sweetalert2';

const baseUrl = `http://localhost:8080/api/`;
const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Host: "localhost:8080",
    "Sec-Fetch-Site": "cross-site",
  },
};

export const api = {

  getConfig() {
    console.log("api.getConfig ")

    const url = 'config';
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  getVersion() {
    console.log("getVersion")

    const url = 'version';
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  getPlan(file: string) {
    console.log("api.getPlan")
    const env = config.uacenv.value;
    const url = `plan?plan=${file}&uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  // Kaldt fra handleTaskClick i TreeComponent
  getTask(name: string) {
    console.log("api.getTask", name);
    const env = config.uacenv.value;
    const url = `task?taskname=${name}&uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  updateTask(body: any) {
    console.log("updateTask api");
    const env = config.uacenv.value;
    const url = `updatetask?uacenv=${env}`;

    const updatedOptions = {
      ...options,
      method: "PUT",
      body: JSON.stringify(body)
    };
    console.log(body);
    console.log(updatedOptions);

    return fetch(baseUrl + url, updatedOptions)
      .then((data) => {
        console.log(data)
        return data
      })
      .catch((error) => {
        console.log(error);
      });
  },
  
  getParamList() {
    const env = config.uacenv.value;
    const url = `parameters?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  getMissing() {
    const env = config.uacenv.value;
    const url = `missing?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options);
  },

  // kaldes fra WorkflowComponent
  getAllWorkflows() {
    console.log(config);
    console.log(config.uacenv.value);
    const env = config.uacenv.value;
    console.log("api.getAllWorkflows ", env);
    const url = `listadv?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  // Kaldes fra Toolbar
  updatePlan() {
    console.log("updateplan api");
    const env = config.uacenv.value;
    console.log("api.put ", env);
    const url = `plan?uacenv=${env}`;
    options.method = "PUT";
    return fetch(baseUrl + url, options)
  },

  // Kaldes fra Toolbar
  progress() {
    console.log("progress api");
    options.method = "GET";
    const url = "progress";
    return fetch(baseUrl + url, options)
  },

  // Kaldes fra Toolbar
  deletePlan() {
    console.log("updateplan api");
    const env = config.uacenv.value;
    console.log("api.delete ", env);
    const url = `plan?uacenv=${env}`;
    options.method = "DELETE";
    return fetch(baseUrl + url, options)
  },

  
  getPlandir(directory: string) {
    const env = config.uacenv.value;
    console.log("api.getPlandir ", directory);
    const url = `plandir/?directory=${directory}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  startEditor(file: string) {
    console.log("api.editor ", file);
    const url = `editor/?fileName=${file}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  startExplorer(file: string) {
    console.log("api.explorer ", file);
    const url = `explorer/?dirName=${file}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
  },

  // Er ikke implementeret færdig, driften ønsker ikke flere rettelser
  delete(file: string) {
    console.log("api.delete ", file);
    const url = `delete/?fileName=${file}`;
    options.method = "DELETE";
    return fetch(baseUrl + url, options)
  },
}