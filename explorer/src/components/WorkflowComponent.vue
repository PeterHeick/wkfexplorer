<template>
  <div>
    <div class="header">
      <HeaderComponent>Workflow explorer</HeaderComponent>
    </div>
    <div>
      <ToolbarComponent @envEvent="handleEnvEvent" type="workflow"></ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <div v-if="!state.isWkfLoaded" class="loader" style="justify-items: center">
          Loading...
        </div>
        <div v-if="!state.isWkfLoaded">
          <span class="spinner" />
        </div>

        <TreeComponent v-if="state.isWkfLoaded" :treeData="wkf" @currentNodeEvent="handleCurrentNodeEvent">
        </TreeComponent>
      </div>
      <div id="middle">
        <TaskComponent v-if="nodeName != ''" :nodeName="nodeName"></TaskComponent>
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
import TaskComponent from "@/components/explorer/tasks/TaskComponent.vue";
import { TreeNode } from "@/types/interfaces";
import { api } from "@/api/api";
import { config } from "@/store/config";
import { state } from "@/store/state";
import Swal from "sweetalert2";

let wkf = ref([] as TreeNode[]);
const nodeName = ref("");

const handleEnvEvent = (env: string) => {
  console.log("Skift environment til: ", env);
  config.setEnv(env);
  update();
};

const handleCurrentNodeEvent = (name: string) => {
  console.log("WorkflowComponent, handleCurrentNodeEvent ", name);
  nodeName.value = name;
};

const update = async () => {
  state.isWkfLoaded = false;
  const response = await api.getAllWorkflows();
  const data = await response.json();
  if (!response.ok) {
    Swal.fire(data.message, data.detail, 'error');
    state.isWkfLoaded = true;
    wkf.value = [];
    return;
  }
  wkf.value = data;
  state.isWkfLoaded = true;
  console.log(wkf.value);
  console.log(
    "workflowComponent.update() done length of data ",
    wkf.value.length
  );
  console.log("isLoaded ", state.isWkfLoaded);
};

onMounted(() => {
  console.log("WorkflowComponent");
  if (!state.isConfigLoaded) {
    config.init();
  }
  update();
});

</script>

<style scoped>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #000;
  animation: spinner 0.6s linear infinite;
  position: relative;
}
</style>