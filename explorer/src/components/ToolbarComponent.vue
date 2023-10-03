<template>
  <div class="toolbar">
    <div v-show="type === 'plan'" class="planButtons">
      <ButtonComponent :disable="state.planDelete || !state.isPlanRead" @buttonClicked="handleDelete">
        Slet fra UAC
      </ButtonComponent>
      <ButtonComponent :disable="!state.isPlanRead" @buttonClicked="handleUpdate">
        Flyt til UAC
      </ButtonComponent>
      <div v-if="updateProgress > 0" style="font-weight: bold; padding-right: 10px">
        {{ updateProgress.toFixed(0) }} pct
      </div>
    </div>
    <div class="dropdown">
      <button :disabled="disable" @click="toggleDropdown" class="dropbtn">{{ selectedItem }}</button>
      <div v-show="isDropdownVisible" class="dropdown-content">
        <a v-for="(env, index) in environmentList" :key="index" href="#" @click="
          $emit('envEvent', env);
        selectedItem = env;
        isDropdownVisible = false;">
          {{ env }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { config } from "@/store/config";
import { computed, defineProps, defineEmits, onBeforeMount, onUnmounted, ref, toRef } from "vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { api } from "@/api/api";
import Swal from "sweetalert2";
import { state } from "@/store/state";

let environmentList = ref<string[]>([]);
let selectedItem = toRef(config, "uacenv");
let intervalId = 0;
const updateProgress = ref(0);
const isDropdownVisible = ref(false);

const emit = defineEmits(["planRead", "envEvent", "missingEvent", 'updateParamList']);
defineProps({ type: String });

// disable button if something is not loaded
const disable = computed(() => {
  return !state.isWkfLoaded || state.planUpdateInProgress
})

const toggleDropdown = () => {
  console.log("Toggle dropdown");
  isDropdownVisible.value = !isDropdownVisible.value;
};

/*
const handlePlanRead = (plan: string) => {
  console.log("Toolbar handlePlanRead", plan);
  state.planDelete = false;
  emit("planRead", plan);
};
*/

const handleDelete = async () => {
  console.log("handleDelete");
  state.planDelete = true;
  const response = await api.deletePlan();
  console.log("delete plan, ", response)
  if (!response.ok) {
    console.log(response);
    Swal.fire("delete fejlet", "", 'error');
    clearInterval(intervalId);
    return;
  }
  Swal.fire("Plan slettet", "", 'success');
  state.planDelete = false;
  emit('envEvent', selectedItem.value);
}

const handleUpdate = async () => {
  console.log("handleUpdate");
  updateProgress.value = 0;
  state.planUpdateInProgress = true;
  startProgressCounter();

  const response = await api.updatePlan();
  const data = await response.json();

  if (!response.ok) {
    console.log(response);
    Swal.fire(data.message, data.detail, 'error');
    clearInterval(intervalId);
    state.planUpdateInProgress = false;
    updateProgress.value = 0;
    return;
  }

  // data.missing a list of missing tasks if any
  emit("missingEvent", data.missing);
  emit('updateParamList');
  state.planUpdateInProgress = false;
  clearInterval(intervalId);
  updateProgress.value = 0;
  Swal.fire('Plan opdateret', '', 'success');
};

const startProgressCounter = async () => {
  intervalId = setInterval(async () => {
    const response = await api.progress();
    const data = await response.json();
    console.log("progress: ", data.pct);

    updateProgress.value = data.pct;

    console.log(data.pct);

    // Check if the update is finished
    if (updateProgress.value >= 99) {
      updateProgress.value = 100;
      clearInterval(intervalId);
    }
  }, 1000);
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
  position: relative;
  display: flex;
  padding-top: 2px;
  height: 25px;
  cursor: default;
  background-color: white;
  margin: 0px;
  border-bottom: 1px solid #ccc;
  align-items: center;
}

.toolbar button {
  width: 90px;
}

.planButtons {
  display: flex;
  align-items: center;
  padding-left: 10px;
  min-width: 150px;
}

.dropdown {
  position: absolute;
  left: 400px;
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
  font-size: 14px;
}

.dropdown-content {
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  width: 60px;
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
</style>
