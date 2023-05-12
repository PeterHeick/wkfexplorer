<template>
  <div v-if="workflowsAreLoading" class="loader" style="justify-items: center">
    Loading...
  </div>
  <div v-if="workflowsAreLoading">
    <span class="spinner" />
  </div>

  <TreeComponent v-if="!workflowsAreLoading" :treeData="wkf"></TreeComponent>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed, reactive, toRef } from "vue";
import TreeComponent from "./TreeComponent.vue";
import { workflowStore } from "../../store/workflowStore";

export default defineComponent({
  components: {
    TreeComponent,
  },

  setup() {
    const wkf = toRef(workflowStore, 'wkf');
    let workflowsAreLoading = toRef(workflowStore, 'isLoading');

    onBeforeMount(() => {
      console.log("ExplorerComponent ", workflowsAreLoading.value);
      console.log(JSON.stringify(wkf.value));
    });

    return {
      wkf,
      workflowsAreLoading,
    };
  },
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