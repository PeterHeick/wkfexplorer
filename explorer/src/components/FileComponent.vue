<template>
  <div class="file-explorer" style="padding-right: 10px;">
    <span @click="openFileExplorer" class="dirHeader">{{ directory }}</span>
    <ul>
      <file-item v-for="item in items" :key="item.name" :item="item" @getPlanFile="emitGetPlanFile" @updateFileExplorer="fetchData" />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { api } from '@/api/api';
import { ref, onMounted, defineEmits, watch } from 'vue';
import FileItem from './FileItem.vue';
import { config } from '@/store/config';

interface dirEnt {
  name: string,
  path: string,
  type: string
}
const emit = defineEmits(['getPlanFile']);

const directory = ref(''); // Initial directory
const items = ref([] as dirEnt[]); // Files and folders

// Function to fetch data from the server
async function fetchData(directoryPath: string) {
  try {
    const response = await api.getPlandir(directoryPath);
    const data = await response.json();

    // Update the directory and items
    directory.value = directoryPath;
    items.value = data;
  } catch (err) {
    console.error(err);
  }
}

const openFileExplorer = () => {
  console.log("openFileExploerer")
  api.startExplorer(directory.value).then(() => fetchData(config.getPlanDir()));
}

const emitGetPlanFile = (fileName: string) => {
  emit('getPlanFile', fileName);
}

watch(() => config.uacenv.value, () => {
  const cfg = config.getEnvironment();
  console.log("watch config.uacenv ", cfg.planDir);
  fetchData(cfg.planDir);
});

onMounted(() => {
  const cfg = config.getEnvironment();
  fetchData(cfg.planDir); // Fetch the data for the initial directory when the component is mounted
});

function watchEffect(arg0: () => void) {
  throw new Error('Function not implemented.');
}
</script>

<style>
.dirHeader {
  padding: 20px;
  font-weight: bold;
  cursor: pointer;
}

.dirHeader:hover {
  background-color: #ddd;
}
</style>