<template>
  <div v-if="isLoading" class="loader" style="justify-items: center">
    Loading...
  </div>
  <div v-if="isLoading">
    <span class="spinner" />
  </div>

  <TreeComponent v-if="!isLoading" :treeData="wkf"></TreeComponent>
</template>

<script lang="ts" setup>
import { defineProps, onBeforeMount, } from "vue";
import TreeComponent from "./TreeComponent.vue";
import { TreeNode } from "@/types/interfaces";

defineProps({
  wkf: {
    type: Array as () => TreeNode[],
    default: () => {
      return [] as TreeNode[];
    },
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})

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