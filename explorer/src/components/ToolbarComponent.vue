<template>
  <div class="dropdown" v-show="!workflowsAreLoading">
    <button class="dropbtn">{{ selectedItem }}</button>
    <div class="dropdown-content">
      <a
        v-for="(env, index) in environmentList"
        :key="index"
        href="#"
        @click="updateWorkflow(env)"
        >{{ env }}</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import config from "@/store/config";
import { workflowStore } from "@/store/workflowStore";
import { defineComponent, onBeforeMount, ref, toRef } from "vue";

export default defineComponent({
  props: {
    type: String,
  },
  setup(props) {
    let environmentList = ref<string[]>([]);
    let workflowsAreLoading = toRef(workflowStore, "isLoading");
    let selectedItem = toRef(config, "uacenv");

    function updateWorkflow(env: string) {
      // selectedItem.value = env;
      config.setEnv(env);
      workflowStore.update(props.type as string,);
    }

    onBeforeMount(() => {
      console.log("ToolbarComponent onBeforeMount");
      environmentList.value = config.getEnvironmentList();
      workflowStore.update(props.type as string,);
    });

    return {
      environmentList,
      workflowsAreLoading,
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
  padding-top: 2px;
  height: 25;
  width: 100%;
  border: 0px;
  cursor: default;
  background-color: white;
  vertical-align: center;
  margin: 0px;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  align-items: center;
}

.toolbar button {
  width: 90px;
}

.dropdown {
  position: relative;
  padding: 2px 5px 4px 43px;
  display: inline-block;
}

.dropbtn {
  height: 21.1667px;
  width: 90px;
  border: none;
  background-color: #e6e6e6;
  color: #000;
  border-radius: 4px;
  border: 1px solid #999;
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
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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