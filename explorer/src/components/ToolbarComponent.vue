<template>
  <!--
  <div class="dropdown" v-show="!workflowsAreLoading">
    -->
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropbtn">{{ selectedItem }}</button>
    <div v-show="isDropdownVisible" class="dropdown-content">
      <a v-for="(env, index) in environmentList" :key="index" href="#" @click="
        $emit('envEvent', env);
      selectedItem = env;
      isDropdownVisible = false;
      ">{{ env }}</a>
    </div>
  </div>
  <div style="display: flex; align: center">
    <div v-if="updateProgress > 0" style="font-weight: bold; padding-right: 10px">
      {{ updateProgress.toFixed(0) }} pct
    </div>
    <ButtonComponent :disable="!updateEnabled" @click="handleUpdate">Update</ButtonComponent>
    <FilePickComponent @planEvent="handlePlanEvent" v-show="type === 'plan'"></FilePickComponent>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
import { config } from "@/store/config";
import { defineProps, onBeforeMount, onUnmounted, ref, toRef } from "vue";
import FilePickComponent from "./FilePickComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { api } from "@/api/api";
import Swal from "sweetalert2";

defineProps({ type: String });
let environmentList = ref<string[]>([]);
let updateEnabled = ref<boolean>(false);
let selectedItem = toRef(config, "uacenv");
let intervalId = 0;
const updateProgress = ref(0);
const isDropdownVisible = ref(false);
const emit = defineEmits(["planEvent", "envEvent", "missingEvent"]);

const toggleDropdown = () => {
  console.log("Toggle dropdown");
  isDropdownVisible.value = !isDropdownVisible.value;
};

const handlePlanEvent = (plan: string) => {
  console.log("Toolbar handlePlanEvent", plan);
  updateEnabled.value = true;
  emit("planEvent", plan);
};

const handleUpdate = async () => {
  console.log("handleUpdate");
  updateEnabled.value = false;
  update();
  const response = await api.updatePlan();
  const data = await response.json();
  console.log(response);
  console.log(data);
  if (!response.ok) {
    Swal.fire(data.message, data.detail, 'error');
    clearInterval(intervalId);
    return;
  }

  // data.missing a list of missing tasks if any
  emit("missingEvent", data.missing);
  updateEnabled.value = true;
  clearInterval(intervalId);
  updateProgress.value = 0;
};

const update = async () => {
  intervalId = setInterval(async () => {
    const response = await api.progress();
    const data = await response.json();

    updateProgress.value = data.pct;

    console.log(data.pct);

    // Check if the update is finished
    if (updateProgress.value >= 99) {
      updateProgress.value = 100;
      clearInterval(intervalId);
    }
  }, 1000); // 1000 milliseconds = 1 second
};

onUnmounted(() => {
  clearInterval(intervalId);
});

onBeforeMount(() => {
  console.log("ToolbarComponent onBeforeMount");
  environmentList.value = config.getEnvironmentList();
});
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
  content: "\25BC";
  /* pil-ned tegn */
  font-size: 16px;
  color: #000;
  top: 0;
  right: 0;
  padding: 12px 12px 12px 1px;
  pointer-events: none;
}
</style>
