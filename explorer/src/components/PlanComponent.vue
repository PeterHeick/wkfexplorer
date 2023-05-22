<template>
  <div>
    <div class="header">
      <HeaderComponent>Plan explorer</HeaderComponent>
    </div>
    <div class="toolbar">
      <ToolbarComponent @envEvent="handleEnvEvent" @planEvent="handlePlanEvent" @missingEvent="handleMissing" type="plan">
      </ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <TreeComponent v-if="!isLoading" :treeData="wkf"></TreeComponent>
      </div>
      <div id="middle">
        <div v-if="missingList.length > 0">
          <h2>Ikke definerede workflows:</h2>
          <ul>
            <li v-for="(node, index) in missingList" :key="index" class="list">
              {{ node }}
            </li>
          </ul>
        </div>
      </div>
      <div id="right-pane"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ToolbarComponent from "@/components/ToolbarComponent.vue";
import TreeComponent from "@/components/explorer/TreeComponent.vue";

import { api } from "@/api/api";
import { TreeNode } from "@/types/interfaces";
import { config } from "@/store/config";
import Swal from "sweetalert2";

let wkf = ref([] as TreeNode[]);
let isLoading = ref(true);
const missingList = ref([] as string[]);

const handleEnvEvent = (env: string) => {
  config.setEnv(env);
};

const handlePlanEvent = async (file: string) => {
  console.log("handleEvent ", file);
  isLoading.value = true;
  try {
    const response = await api.getPlanData(file)
    const data = await response.json();
    console.log("response.ok ", response.ok);
    console.log("data ", JSON.stringify(data));
    if (!response.ok) {
      Swal.fire(data.message, data.detail, 'error');
      wkf.value = [];
      isLoading.value = false;
      return;
    }
    wkf.value = data.wkf;
    console.log("workflowStore.update()");
    isLoading.value = false;
    console.log("api.getPlanData length: ", Object.keys(data).length);
  } catch (error) {
    console.log(error);
    Swal.fire("Fejl ved indlæsning af plan", `Et eller andet gik galt ${JSON.stringify(error)}`, 'error');
    wkf.value = [];
    isLoading.value = false;
  }
}

const handleMissing = (list: Array<string>) => {
  console.log("handle missing list ", list);
  for (const element of list) {
    missingList.value.push(element);
  }

  console.log(missingList.value);
}

onMounted(() => {
  console.log("PlanComponent");
  if (!config.isLoaded.value) {
    config.init();
  }

})

</script>
<style lang="scss"></style>
