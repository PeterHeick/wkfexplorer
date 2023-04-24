<template>
  <div class="task" v-show="taskNode.id > 0">
    <GeneralComponent :taskNode="taskNode"></GeneralComponent>
    <AgentComponent :taskNode="taskNode"></AgentComponent>
    <TaskUnixComponent :taskNode="taskNode"></TaskUnixComponent>
  </div>
</template>
<script lang="ts">
import { TreeNode } from "@/types/interfaces";
import { defineComponent } from "vue";
import GeneralComponent from "./GeneralComponent.vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";
import AgentComponent from"./AgentComponent.vue";

export default defineComponent({
  components: { GeneralComponent, TaskUnixComponent, AgentComponent },
  props: {
    taskNode: {
      type: Object as () => TreeNode,
      default: () => {
        return {} as TreeNode;
      },
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
</style>
