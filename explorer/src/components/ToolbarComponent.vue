<template>
  <div class="toolbar">
    <div class="dropdown" v-show="!isloading" >
      <button class="dropbtn">{{ selectedItem }}</button>
      <div class="dropdown-content" v-if="!isLoading">
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
import { defineComponent, onMounted, ref, toRef } from "vue";

export default defineComponent({
  setup() {
    let environments = ref<string[]>([]);
    let isLoading = ref(workflowStore.isLoading);
    let selectedItem = toRef(config, "uacenv");
    let showMenu = false;
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
        isLoading.value = false;
        console.log('ToolbarComnponent: env: ', env);
      });
    });

    return {
      environments,
      isLoading,
      selectedItem,
      updateWorkflow,
    };
  },
});
//<a v-for="(env, index) in environments" :key="index" href="#" @click="selectedItem =env">{{
</script>


<style>
.toolbar {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-bottom: 1px solid #ccc;
  padding: 4px 5px 4px 43px;
}

.toolbar button {
  width: 90px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  height: 21.1667px;
  width: 90px;
  border: none;
  background-color: #e6e6e6;
  color: #000;
  border-radius: 4px;
  border: 1px solid #999;;
  cursor: pointer;
  align-items: center;
  font-size: 14px;
}

.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
  min-width: 60px;
  font-size: 14px;
  border: none;
  background-color: #f2f2f2;
  border-radius: 4px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown-content a {
  color: #000;
  padding: 6px 12px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #ddd;
}

.dropdown::after {
  content: "\25BC"; /* pil-ned tegn */
  font-size: 16px;
  color: #000;
  top: 0;
  right: 0;
  padding: 12px 12px 12px 1px;
  pointer-events: none;
}
</style>