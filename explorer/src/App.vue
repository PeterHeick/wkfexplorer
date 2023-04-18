<template>
  <div class="app">
    <div id="header">
      <HeaderComponent></HeaderComponent>
    </div>
    <div id="container">
      <div id="left-pane">
        <ExplorerComponent></ExplorerComponent>
      </div>
      <div id="middle">
        <TaskComponent></TaskComponent>
      </div>
      <div id="right-pane">
        <h1>Hallo right pane</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "./store/config";
import { defineComponent, onBeforeMount } from "vue";
import ExplorerComponent from "./components/explorer/ExplorerComponent.vue";
import TaskComponent from "./components/explorer/tasks/TaskComponent.vue";
import HeaderComponent from "./components/header/HeaderComponent.vue";

export default defineComponent({
  name: "App",
  components: { HeaderComponent, ExplorerComponent, TaskComponent },
  setup() {
     onBeforeMount(async () => {
      store.getConfigData();
    });
    return {};
  },
});
</script>

<style lang="scss"></style>
