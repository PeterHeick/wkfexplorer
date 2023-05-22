import { config } from '@/store/config';

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
    return fetch(baseUrl + url, options)
  },

  getPlanData(file: string) {
    console.log("api.getPlanData ")
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

  // env eks: "usprod"
  // kaldes fra WorkflowComponent
  getAllWorkflows() {
    console.log(config);
    console.log(config.uacenv.value);
    const env = config.uacenv.value;
    console.log("api.getAllWorkflows ", env);
    const url = `listadv?uacenv=${env}`;
    options.method = "GET";
    return fetch(baseUrl + url, options)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
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
    const env = config.uacenv.value;
    options.method = "GET";
    const url = "progress";
    return fetch(baseUrl + url, options)
  },
}