<template>
  <!--
  <div class="task" v-show="task.value.id > 0">
    -->
  <div class="task" v-show="true">
    <GeneralComponent :taskNode="task.value"></GeneralComponent>
    <AgentComponent :taskNode="task.value"></AgentComponent>
    <TaskUnixComponent :taskNode="task.value"></TaskUnixComponent>
  </div>
</template>
<script lang="ts">
import { TreeNode } from "@/types/interfaces";
import { defineComponent, onMounted, reactive } from "vue";
import GeneralComponent from "./GeneralComponent.vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";
import AgentComponent from "./AgentComponent.vue";
import { api } from "@/api/api";
import { config } from "@/store/config";

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
  setup(props) {
    const task = reactive({ value: {} as TreeNode });
    onMounted(() => {
      console.log("taskComponent.onMounted: ");
      api.getTask(props.taskNode.name, config.uacenv.value)
      .then((data) => {
        task.value = data as TreeNode;
        console.log(JSON.stringify(data));
      })
      .catch(error => {
        console.log('TaskComponent ', error);
      });
    });
    return {task};
  },
});
</script>

<style scoped>
</style>
