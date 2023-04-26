<template>
  <div class="app">
    <div id="header">
      <HeaderComponent></HeaderComponent>
    </div>
    <div id="toolbar">
      <ToolbarComponent></ToolbarComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <ExplorerComponent></ExplorerComponent>
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
import { defineComponent, onMounted } from "vue";
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
    onMounted(async () => {
      await config.init();
      console.log('App config.init: env ', config.getEnv());
    });
    return {};
  },
});
</script>

<style lang="scss"></style>
