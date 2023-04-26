import { TreeNode, UacConfig } from '@/types/interfaces';
import { ref } from 'vue';

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
  // configData: {} as UacConfig,
  // uacenv: ref("ussand"),
  // treeData: {} as TreeNode,

  getDefaultEnv() {
    const url = `uacenv`;
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        console.log('api.getDefaultEnv ', data);
    //    this.uacenv = data;
        return data;
      })
  },

  getConfigData(env: string) {
    console.log("api.getConfigData ", env)
    const url = `config?uacenv=${env}`;
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
        // this.configData = data;
        return data;
      })
  },

  getEnvironments() {
    console.log("api.getEnvironments");
    const url = "environments";
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
      //  this.configData = data;
        return data;
      })
  },

  getAllTasks(env: string) {
    console.log("api.getAllTasks");
    const url = `listadv?uacenv=${env}`;
    return fetch(baseUrl + url, headers)
      .then((response) => response.json())
      .then((data) => {
       //  this.treeData = data;
         return data;
      })
  }
}