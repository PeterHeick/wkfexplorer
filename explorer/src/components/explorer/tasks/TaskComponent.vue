<template>
  <div>
    <GeneralComponent :taskNode="task.value"></GeneralComponent>
    <AgentComponent :taskNode="task.value"></AgentComponent>
    <TaskUnixComponent v-if="task.value.type === 'taskUnix' && updated" :taskNode="task.value"></TaskUnixComponent>
    <TaskFtpComponent v-if="task.value.type === 'taskFtp'" :taskNode="task.value"></TaskFtpComponent>
    <TaskEmailComponent v-if="task.value.type === 'taskEmail'" :taskNode="task.value"></TaskEmailComponent>
  </div>
</template>
<script lang="ts">
import { Task } from "@/types/interfaces";
import { defineComponent, onMounted, reactive, ref, toRef, watch } from "vue";
import GeneralComponent from "./GeneralComponent.vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";
import TaskFtpComponent from "./TaskFtpComponent.vue";
import TaskEmailComponent from "./TaskEmailComponent.vue";
import AgentComponent from "./AgentComponent.vue";
import { api } from "@/api/api";
import Swal from 'sweetalert2';

export default defineComponent({
  components: {
    GeneralComponent,
    TaskUnixComponent,
    AgentComponent,
    TaskFtpComponent,
    TaskEmailComponent,
  },
  props: {
    nodeName: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const task = reactive({ value: {} as Task });
    const updated = ref(false);

    const fetchData = async () => {
      console.log("taskComponent.fetch: ", props.nodeName);
      // Der er to typer: workflow og plan
      const response = await api.getTask(props.nodeName)
      try {
        const data = await response.json();
        if (!response.ok) {
          Swal.fire(data.message, data.detail, 'error');
          return;
        }
        task.value = data as any;
        console.log("Task data hentet");
        updated.value = true;
      } catch (error) {
        Swal.fire(response.statusText, "Fejl ved hentning af task", 'error');
      }
    };

    onMounted(() => {
      console.log("taskComponent.onMounted: ", props.nodeName);
      fetchData();
    });

    watch(() => props.nodeName, fetchData);

    return { task, updated };
  },
});
</script>

<style scoped></style>
