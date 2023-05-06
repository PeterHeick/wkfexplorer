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
      <div id="middle"></div>
      <div id="right-pane">
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
  },
  setup() {
    var isLoading = toRef(config, "isLoading");
    onMounted(async () => {
      await config.init();
    });
    return { isLoading };
  },
});
</script>
<style lang="scss"></style>
