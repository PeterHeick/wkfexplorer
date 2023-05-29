<template>
  <div>
    <div class="header">
      <HeaderComponent>Plan explorer</HeaderComponent>
    </div>
    <div class="toolbar">
      <ToolbarComponent @envEvent="handleEnvEvent" @planRead="handlePlanRead" @missingEvent="handleMissing" type="plan">
      </ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <TreeComponent v-if="state.isPlanRead" :treeData="wkf"></TreeComponent>
      </div>
      <div id="middle">
        <div v-if="taskList.value.length > 0">
          <h2>Workflow parametre:</h2>
          <ul>
            <li v-for="(task, index) in taskList.value" :key="index">
              <div class="paramLinje">
                <div class="name"> {{ task.name }} </div>
                <input class="parameter" type="TEXT" id="paramField" @keyup.enter="handleParamUpdate(task)"
                  v-model="task.parameters" />
              </div>
            </li>
          </ul>
          <div v-show="show" class="popup">Opdateret</div>
        </div>
        <div v-if="missingList.length > 0">
          <h2>Manglende workflows:</h2>
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
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ToolbarComponent from "@/components/ToolbarComponent.vue";
import TreeComponent from "@/components/explorer/TreeComponent.vue";

import { api } from "@/api/api";
import { TreeNode } from "@/types/interfaces";
import { config } from "@/store/config";
import { state } from "@/store/state";
import Swal from "sweetalert2";

interface TaskItem {
  sysId: number;
  name: string;
  type: string;
  agent: string;
  command: string;
  exitCodes: number;
  parameters: string;
}

let wkf = ref([] as TreeNode[]);
const missingList = ref([] as string[]);
const taskList = reactive({ value: [] as TaskItem[] });
const show = ref(false);

const handleEnvEvent = async (env: string) => {
  config.setEnv(env);
  missingList.value = [];
  /*
  const missResponse = await api.getMissing();
  if (missResponse.ok) {
    missingList.value = await missResponse.json()
  } else {
    missingList.value = [];
  }
  console.log(missingList.value)
  */
};

// handlePlanRead => get plan from server (Do something)
const handlePlanRead = async (file: string) => {
  console.log("handleEvent ", file);
  // Is plan loaded / read from server  (is it done?)
  state.isPlanRead = false;
  missingList.value = [];
  try {
    const response = await api.getPlanData(file)
    const data = await response.json();
    console.log("response.ok ", response.ok);
    console.log("data ", JSON.stringify(data));
    if (!response.ok) {
      Swal.fire(data.message, data.detail, 'error');
      wkf.value = [];
      state.isPlanRead = false;
      return;
    }
    wkf.value = data.wkf;
    console.log("workflowStore.update()");
    state.isPlanRead = true;
    console.log("api.getPlanData length: ", Object.keys(data).length);
  } catch (error) {
    console.log(error);
    Swal.fire("Fejl ved indlæsning af plan", `Et eller andet gik galt ${error}}`, 'error');
    wkf.value = [];
    state.isPlanRead = false;
  }
}

const handleMissing = (list: Array<string>) => {
  console.log("handle missing list ", list);
  for (const element of list) {
    missingList.value.push(element);
  }

  console.log(missingList.value);
}

const handleParamUpdate = async (task: TaskItem) => {
  console.log("handle param update");
  const elem = document.getElementById("paramField");
  if (elem) elem.blur();
  await api.updateTask(task);
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, 2000);
}

onBeforeMount(async () => {
  console.log("PlanComponent mounted");
  // Den her er ikke relevant for plan, den skal være true her for at knapperne vises.
  state.isWkfLoaded = true;
  state.isPlanRead = false;
  if (!state.isConfigLoaded) {
    config.init();
  }
  const response = await api.getParamList();
  console.log("Get paramlist");
  if (response.ok) {
    taskList.value = await response.json();
    // tempTaskList.forEach((item: TaskItem) => taskList.push(item));
    console.log("Got tasklist 2", taskList);
    console.log("Got tasklist ", taskList.value.length);
  }
  /*
  const missResponse = await api.getMissing();
  if (missResponse.ok) {
    missingList.value = await missResponse.json()
  } else {
    missingList.value = [];
  }
  */
})

</script>

<style>
.paramLinje {
  display: flex;
  align-items: center;
  height: 16px;
  padding: 2px;
}

.name {
  width: 400px;
  border: 1px solid lightgray;
}

.parameter {
  max-width: 300px;
  border: 1px solid lightgray;
}

.popup {
  opacity: 1;
  transition: opacity 2s linear;
  background-color: light-green;
  display: inline-block;
  font-size: 1.2em;
  vertical-align: right;
}

.popup[style*="display: none"] {
  opacity: 0;
}
</style>