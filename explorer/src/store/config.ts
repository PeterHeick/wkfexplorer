import { api } from '@/api/api';
import { ConfigType } from '@/types/interfaces';
import { ref } from 'vue';

/*
  config holder styr på den aktuelle konfiguration
  bla. uacenv. og måske configurationsdata men hvad skal vi bruge konfigurations data til her.
  Kan ikke huske om den bruges nogen steder. Burde undersøges en dag ved lejlighed.
*/
class Config {
  configData = {} as ConfigType;

  // uacenv.value er en string der indeholder eks. "usprod"
  uacenv = ref("");
  isLoading = ref(true);

  // getEnv kan ikke bruges til at returnere uacenv.value,
  // så mister vi reactiviteten.

  setEnv(env: string) {
    console.log("setEnv: ", env);
    this.uacenv.value = env;
  };

  getEnvironment() {
    console.log("getEnvironment()");
    return this.configData.environments[this.uacenv.value];
  };

  getEnvironmentList() {
    return Object.keys(this.configData.environments);
  };

  getBackgroundColor() {
    console.log("getBackgroundColor ", this.configData.environments[this.uacenv.value].backgroundcolor)
    return this.configData.environments[this.uacenv.value].backgroundcolor;
  }

  constructor() {
    console.log("config.init()");
    api.getConfigData()
      .then((data) => {
        this.configData = data;
        this.uacenv.value = data.default;
        this.isLoading.value = false;
        console.log("config: default UACENV: ", this.uacenv.value);
      })
  }
};
const config = new Config();
export default config;