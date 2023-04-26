<template>
  <div class="toolbar">
    <div class="dropdown">
      <button class="dropbtn">{{ selectedItem }}</button>
      <div class="dropdown-content" v-if="!loading">
        <a
          v-for="(env, index) in environments"
          :key="index"
          href="#"
          @click="updateWorkflow(env)"
          >{{ env }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { api } from "@/api/api";
import { config } from "@/store/config";
import { workflowStore } from "@/store/workflowStore";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  setup() {
    let environments = ref<string[]>([]);
    let loading = ref<boolean>(true);
    let selectedItem = ref<string>(config.getEnv());
    //let selectedItem = ref<string>(api.uacenv.value);

    function updateWorkflow(env: string) {
      selectedItem.value = env;
      config.setEnv(env);
      workflowStore.update();
    }

    onMounted(() => {
      console.log("ToolbarComponent onMounted");
      api.getEnvironments().then((env) => {
        environments.value = env;
        loading.value = false;
        console.log('ToolbarComnponent: env: ', env);
      });
    });

    return {
      environments,
      loading,
      selectedItem,
      updateWorkflow,
    };
  },
});
//<a v-for="(env, index) in environments" :key="index" href="#" @click="selectedItem =env">{{
</script>