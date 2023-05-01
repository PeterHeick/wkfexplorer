<template>
  <div class="app">
    <div id="header">
      <HeaderComponent></HeaderComponent>
    </div>
    <div id="toolbar">
      <ToolbarComponent v-if="!isLoading"></ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <ExplorerComponent v-if="!isLoading"></ExplorerComponent>
      </div>
      <div id="middle">
        <TaskComponent></TaskComponent>
      </div>
      <div id="right-pane">
        <h1>Right pane</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRef } from "vue";
import ExplorerComponent from "./components/explorer/ExplorerComponent.vue";
import TaskComponent from "./components/explorer/tasks/TaskComponent.vue";
import HeaderComponent from "./components/header/HeaderComponent.vue";
import ToolbarComponent from "./components/ToolbarComponent.vue";
import { config } from "./store/config";

export default defineComponent({
  name: "App",
  components: {
    HeaderComponent,
    ToolbarComponent,
    ExplorerComponent,
    TaskComponent,
  },
  setup() {
    var isLoading = toRef(config, "isLoading");
    onMounted(async () => {
      await config.init();
      console.log('App config.init: env ', config.getEnv());
    });
    return {isLoading};
  },
});
</script>
isLoading
<style lang="scss"></style>
