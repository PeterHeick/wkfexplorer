<template>
  <div class="file-explorer" style="padding-right: 10px;">
    <span @click="openFileExplorer" class="dirHeader">{{ directory }}</span>
    <ul>
      <file-item v-for="item in items" :key="item.name" :item="item" @file-clicked="emitFileClicked" @editorFinished="fetchData" />
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
const emit = defineEmits(['planRead']);

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
  api.startExplorer(directory.value);
}

const emitFileClicked = (fileName: string) => {
  emit('planRead', fileName);
}


/*
watchEffect(() => {
  const cfg = config.getEnvironment();
  console.log("watch config.uacenv ", cfg.planDir);
  fetchData(cfg.planDir);
});
*/

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