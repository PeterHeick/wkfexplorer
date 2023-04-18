import { Iconfig, State } from '@/types/interfaces';
import { reactive } from "vue";

export const store = {
  configData: {} as Iconfig[],

  getConfigData() {
    const header = {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Sec-Fetch-Site": "cross-site",
      },
    };

    const baseUrl = `http://localhost:8080/api/`;
    const url = 'config';
    return fetch(baseUrl + url, header)
      .then((response: any) => {
        store.configData = response.data;
        console.log(`wkf.value I store: ${JSON.stringify(store.configData)}`);
      })
  }
};
