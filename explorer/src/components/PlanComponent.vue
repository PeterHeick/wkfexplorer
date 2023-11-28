<template>
  <div>
    <div class="header">
      <HeaderComponent>Plan explorer</HeaderComponent>
    </div>
    <div class="toolbar">
      <ToolbarComponent @envEvent="handleEnvEvent" @getPlanFile="handlePlanFileRead" @missingEvent="handleMissing"
        @updateParamList="updateParamList" type="plan">
      </ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <span id="fileheader">
          {{ fileName.split('\.')[0] }}
        </span>
        <TreeComponent v-if="state.isPlanRead" :treeData="wkf" :parmItems="parmItems"></TreeComponent>
      </div>
      <div id="middle">
        <div v-if="taskList.value.length > 0">
          <h2>Workflow parametre:</h2>
          <ul>
            <li v-for="(task, index) in taskList.value" :key="index">
              <div class="paramLinje">
                <div class="name"> {{ task.name }} </div>
                <input class="parameter" type="TEXT" :ref="el => { if (el) paramFields[index] = el; }"
                  @keyup.enter="handleParamUpdate(task, index)" v-model="task.parameters" />
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
        <FileComponent @getPlanFile="handlePlanFileRead"></FileComponent>
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
import { ParmItem, TreeNode } from "@/types/interfaces";
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
let parmItems = ref([] as ParmItem[]);
const missingList = ref([] as string[]);
const taskList = reactive({ value: [] as TaskItem[] });
const show = ref(false);
const paramFields = ref<HTMLElement[]>([]);
const fileName = ref("");

const handleEnvEvent = async (env: string) => {
  console.log("PlanComponent handleEvent env: ", env);
  // config.loadConfig();
  config.setEnv(env);
  updateParamList();
  missingList.value = [];
}

const updateParamList = async () => {
  console.log("updateParamList()");
  const response = await api.getParamList();
  if (response.ok) {
    taskList.value = await response.json();
  }
}
/**
 * This function handles reading a plan file from the server.
 * @param {string} file - The file to be read from the server.
 * @returns {Promise<void>} - A promise that resolves when the plan is successfully read from the server.
 */

// handlePlanFileRead => get plan from server (Do something)
const handlePlanFileRead = async (file: string) => {
  console.log("handlePlanFileRead ", file);

  state.isPlanRead = false;
  fileName.value = file.substring(file.lastIndexOf('\\') + 1);
  missingList.value = [];
  try {
    const response = await api.getPlan(file)
    console.log("response: ", response);
    const data = await response.json();
    console.log("data: ", data);

    if (!response.ok) {
      throw data;
    }
    wkf.value = data.wkf;
    parmItems = data.parmItems;
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
    fileName.value = "";
  }
}

// Handle missing tasks / workflows
const handleMissing = (list: Array<string>) => {
  console.log("handle missing list ", list);
  missingList.value = [];
  for (const element of list) {
    missingList.value.push(element);
  }
}

// Handle param update, opdater task
const handleParamUpdate = async (task: TaskItem, index: number) => {
  console.log("handle param update");
  await api.updateTask(task);
  const elem = paramFields.value[index];
  if (elem) elem.blur();
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
  flex: 1;
  width: 50%;
  border: 1px solid lightgray;
  box-sizing: border-box;
}

.parameter {
  flex: 1;
  width: 50%;
  border: 1px solid lightgray;
  cursor: pointer;
  box-sizing: border-box;
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

#fileheader {
  font-size: 0.8em;
  text-align: right;
  padding: 10px 0px 5px 15px;
  border-bottom: 1px solid lightgray;
}
</style>