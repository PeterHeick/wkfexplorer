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
      <div id="right-pane">
        <FileComponent @planRead="handlePlanRead"></FileComponent>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import ToolbarComponent from "@/components/ToolbarComponent.vue";
import TreeComponent from "@/components/explorer/TreeComponent.vue";
import FileComponent from "@/components/FileComponent.vue";

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
  console.log("PlanComponent handleEvent env: ", env);
  config.loadConfig();
  config.getEnv();
  config.uacenv.value = env;
  //config.setEnv(env);
  config.getEnv();
  const response = await api.getParamList();
  if (response.ok) {
    taskList.value = await response.json();
  }
  missingList.value = [];
}

// handlePlanRead => get plan from server (Do something)
const handlePlanRead = async (file: string) => {
  console.log("handlePlanRead ", file);

  state.isPlanRead = false;
  missingList.value = [];
  try {
    const response = await api.getPlanData(file)
    console.log("response: ", response);
    const data = await response.json();
    console.log("data: ", data);

    if (!response.ok) {
      throw data;
    }
    wkf.value = data.wkf;
    state.isPlanRead = true;

  } catch (error: any) {
    console.log("error: ", error);
    console.log("error.message: ", error.message);
    console.log("error.detail: ", error.detail);
    if (error.message === 'Failed to fetch') {
      Swal.fire('Netværks fejl', 'Fejl ved læsning fra netværk, er serveren startet?', 'error');
      return;
    }

    Swal.fire(error.message, error.detail, 'error');
    wkf.value = [];
    state.isPlanRead = false;
  }
}

// Handle missing tasks / workflows
const handleMissing = (list: Array<string>) => {
  console.log("handle missing list ", list);
  for (const element of list) {
    missingList.value.push(element);
  }
}

// Handle param update, opdater task
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
  // state.isWkfLoaded = true; er ikke relevant for plan, den skal være true i
  // her for at Workflows og Plan knapperne vises.
  state.isWkfLoaded = true;
  state.isPlanRead = false;
  if (!state.isConfigLoaded) {
    config.init();
  }
  const response = await api.getParamList();
  if (response.ok) {
    taskList.value = await response.json();
  }
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
  cursor: pointer;
}

.parameter:hover {
  background-color: #ddd;
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