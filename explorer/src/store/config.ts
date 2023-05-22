import { api } from '@/api/api';
import { ConfigType } from '@/types/interfaces';
import { ref } from 'vue';
import Swal  from 'sweetalert2';

/*
  config holder styr på den aktuelle konfiguration
  bla. uacenv.value. og dermed den aktuelle tilstand. Hvilket miljø arbejder vi med lige nu.
  Andre komponenter spørger config om aktuel tilstand.
*/

class Config {
  isLoaded = ref(false);
  configData = {} as ConfigType;

  // uacenv.value.value er en string der indeholder eks. "usprod"
  uacenv = ref("");

  // getEnv kan ikke bruges til at returnere uacenv.value.value,
  // så mister vi reactiviteten.

  setEnv(env: string) {
    console.log("setEnv: ", env);
    this.uacenv.value = env;
  }

  getEnvironment() {
    console.log("getEnvironment()");
    return this.configData.environments[this.uacenv.value];
  }

  getEnvironmentList() {
    return Object.keys(this.configData.environments);
  }

  getBackgroundColor() {
    console.log("getBackgroundColor ", this.configData.environments[this.uacenv.value].backgroundcolor)
    return this.configData.environments[this.uacenv.value].backgroundcolor;
  }

  async init() {
    console.log("config.init()");

    try {
      const response = await api.getConfig();
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        Swal.fire(data.message,data.detail,'error');
      } else {
        this.configData = data;
        this.uacenv.value = data.default;
        this.isLoaded.value = true;
        console.log("api.getConfigData length: ", Object.keys(data.environments).length);
        console.log("config: default UACENV: ", this.uacenv.value);
      }
    } catch (error) {
      console.error("Fejl under anmodning:", error);
    }
  }

  constructor() {
    console.log("Initialising config");
    /*
    api.getConfig()
      .then(response => response.json())
      .then((data) => {
        this.configData = data;
        this.uacenv.value = data.default;
        this.isLoaded.value = true;
        console.log("config: default UACENV: ", this.uacenv.value);
      })
      */
  }
}

export const config = new Config();