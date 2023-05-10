<template>
  <div v-if="!configIsLoading">
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
      <div id="middle"></div>
      <div id="right-pane"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, toRef, watch } from "vue";
import ExplorerComponent from "./components/explorer/ExplorerComponent.vue";
import HeaderComponent from "./components/header/HeaderComponent.vue";
import ToolbarComponent from "./components/ToolbarComponent.vue";
import config from "./store/config";

export default defineComponent({
  name: "App",
  components: {
    HeaderComponent,
    ToolbarComponent,
    ExplorerComponent,
  },
  setup() {
    let configIsLoading = toRef(config, 'isLoading');

    onMounted(() => console.log("App.vue"));
    return {configIsLoading};
  },
});
</script>
<style lang="scss"></style>
