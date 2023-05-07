<template>
  <div v-if="isLoading" class="loader" style="justify-items: center" >Loading...</div>
  <div v-if="isLoading">
    <span class="spinner" />
  </div>

  <TreeComponent v-if="!isLoading" :treeData="wkf"></TreeComponent>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import TreeComponent from "./TreeComponent.vue";
import { workflowStore } from "../../store/workflowStore";

export default defineComponent({
  components: {
    TreeComponent,
  },

  setup() {
    const wkf = computed(() => workflowStore.wkf);
    const isLoading = computed(() => workflowStore.isLoading);

    onMounted(() => {
      workflowStore.update()
    });

    return {
      wkf,
      isLoading,
    };
  },
});
</script>
<style scoped>

@keyframes spinner {
  to {transform: rotate(360deg);}
}

.spinner:before {
  content: '';
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
  animation: spinner .6s linear infinite;
  position: relative;

}

 

</style>