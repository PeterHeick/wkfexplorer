import { api } from '@/api/api';
import { UacConfig } from '@/types/interfaces';
import { ref } from 'vue';

/*

  config holder styr på den aktuelle konfiguration
  bla. uacenv. og måske configurationsdata men hvad skal vi bruge konfigurations data til her.
  Kan ikke huske om den bruges nogen steder. Burde undersøges en dag ved lejlighed.

*/
export const config = {
  configData: {} as UacConfig,
  uacenv: ref(""),
  isLoading: ref(true),

  // Kaldes fra app.vue
  async init() {
    await api.getDefaultEnv()
    .then((env) => {
      this.uacenv.value = env;
      this.isLoading.value = false;
    })
  },

  // Denne benyttes vist ikke
  getEnv() {
    return this.uacenv;
  },

  setEnv(env: string) {
    this.uacenv.value =env;
  },

  async getConfigData(env: string) {
    const header = {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Sec-Fetch-Site": "cross-site",
      },
    };

    console.log("getConfigData ", env)
    const baseUrl = `http://localhost:8080/api/`;
    const url = `config?uacenv=${env}`;
    const response = await fetch(baseUrl + url, header);
    const responseData: UacConfig = await response.json();
    this.configData = responseData;

    console.log(`UAC config: ${JSON.stringify(responseData)}`)
    /*
    await fetch(url, header)
    .then((response) => response.json())
    .then((data) => store.configData = data);
    */
  }
};
