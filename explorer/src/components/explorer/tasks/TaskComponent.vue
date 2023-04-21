<template>
  <div v-if="taskNode.name === shownNode">
    <GeneralComponent :taskNode="taskNode"></GeneralComponent>
    <AgentComponent :taskNode="taskNode"></AgentComponent>
    <TaskUnixComponent :taskNode="taskNode"></TaskUnixComponent>
  </div>
</template>
<script lang="ts">
import { ItreeNode } from "@/types/interfaces";
import { defineComponent } from "vue";
import GeneralComponent from "./GeneralComponent.vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";
import AgentComponent from"./AgentComponent.vue";

export default defineComponent({
  components: { GeneralComponent, TaskUnixComponent, AgentComponent },
  props: {
    taskNode: {
      type: Object as () => ItreeNode,
      default: () => {
        return {} as ItreeNode;
      },
    },
    shownNode: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
</style>
