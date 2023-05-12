<template>
  <div v-if="workflowType === 'workflow'">
    <GeneralComponent :taskNode="task.value"></GeneralComponent>
    <AgentComponent :taskNode="task.value"></AgentComponent>
    <TaskUnixComponent
      v-if="task.value.type === 'taskUnix'"
      :taskNode="task.value"
    ></TaskUnixComponent>
    <TaskFtpComponent
      v-if="task.value.type === 'taskFtp'"
      :taskNode="task.value"
    ></TaskFtpComponent>
    <TaskEmailComponent
      v-if="task.value.type === 'taskEmail'"
      :taskNode="task.value"
    ></TaskEmailComponent>
  </div>
</template>
<script lang="ts">
import { Task, TreeNode } from "@/types/interfaces";
import { defineComponent, onMounted, reactive, toRef } from "vue";
import GeneralComponent from "./GeneralComponent.vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";
import TaskFtpComponent from "./TaskFtpComponent.vue";
import TaskEmailComponent from "./TaskEmailComponent.vue";
import AgentComponent from "./AgentComponent.vue";
import { api } from "@/api/api";
import config from "@/store/config";
import { workflowStore } from "@/store/workflowStore";

export default defineComponent({
  components: {
    GeneralComponent,
    TaskUnixComponent,
    AgentComponent,
    TaskFtpComponent,
    TaskEmailComponent,
  },
  props: {
    taskNode: {
      type: Object as () => TreeNode,
      default: () => {
        return {} as TreeNode;
      },
    },
  },
  setup(props) {
    const task = reactive({ value: {} as Task });
    const workflowType = toRef(workflowStore, "type");
    onMounted(() => {
      console.log("taskComponent.onMounted: ");
      if (workflowType.value === "workflow") {
        api
          .getTask(props.taskNode.name, config.uacenv.value)
          .then((data) => {
            task.value = data as any;
            console.log(JSON.stringify(data));
          })
          .catch((error) => {
            console.log("TaskComponent ", error);
          });
      }
    });
    return { task, workflowType };
  },
});
</script>

<style scoped>
</style>
