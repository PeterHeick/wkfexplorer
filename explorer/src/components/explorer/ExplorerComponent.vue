<template>
  <h2>Data fra API</h2>
  <button @click="getData">Hent data</button>
  <TreeComponent :treeData="wkf"></TreeComponent>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import TreeComponent from "./TreeComponent.vue";
import { ItreeNode } from "@/types/interfaces";
import { store }  from "../../store/config";
 

//const baseUrl = `http://localhost:8080/uac/`;
const baseUrl = `http://localhost:8080/test/`;

const config = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Host: "localhost:8080",
    "Sec-Fetch-Site": "cross-site",
  },
};

export default defineComponent({
  components: {
    TreeComponent,
  },

  setup() {
    const localValue = ref("");
    const wkf = ref<ItreeNode[]>([]);
    const url = "listadv?uacenv=ussand";
    async function getData() {
      console.log("getData");
      try {
        console.log(baseUrl + url + "  " + JSON.stringify(config));
        const response = await fetch(baseUrl + url, config);
        const responseData: ItreeNode[] = await response.json();
        wkf.value = responseData;

        console.log(`wkf.value: ${JSON.stringify(wkf.value)}`);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    function handleChange(newVal: any, oldVal: any) {
      console.log("Changed iExplorerComponent");
    }

    console.log(store.configData);
    onMounted(() => {
      getData();
    });

    // Brug watch til at overvåge en bestemt reaktiv kilde
    watch(
      () => wkf.value,
      (newVal, oldVal) => {
        console.log("wkf.value er ændret fra", oldVal, "til", newVal);
      }
    );

    // Brug watchEffect til at reagere på alle reaktive kilder i dens funktion
    watchEffect(() => {
      console.log("inputProp er nu");
    });

    return {
      wkf,
      getData,
    };
  },
});
</script>
