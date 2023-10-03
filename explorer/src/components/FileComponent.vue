<template>
  <div class="file-explorer" style="padding-right: 10px">
    <span @click="openFileExplorer" class="dirHeader">{{ directory }}</span>
    <ul>
      <file-item v-for="item in items" :key="item.name" :item="item" @getPlanFile="emitGetPlanFile" />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/api/api";
import { ref, onMounted, defineEmits, watch, onBeforeUnmount } from "vue";
import FileItem from "./FileItem.vue";
import { config } from "@/store/config";
import Swal from "sweetalert2";

interface dirEnt {
  name: string;
  path: string;
  type: string;
}
const emit = defineEmits(["getPlanFile"]);

const directory = ref(""); // Initial directory
const items = ref([] as dirEnt[]); // Files and folders
const port = process.env.VUE_APP_WEBSOCKET_PORT;
const host = process.env.VUE_APP_HOST;

let ws: WebSocket;

// Function to fetch data from the server
async function fetchData() {
  const planDir = config.getPlanDir();
  console.log("fetchData", planDir);
  try {
    const response = await api.getPlandir(planDir);
    const data = await response.json();
    // Update the directory and items
    directory.value = planDir;
    items.value = data;
  } catch (err) {
    console.error(err);
  }
}

const openFileExplorer = () => {
  console.log("openFileExploerer");
  api.startExplorer(directory.value);
};

const emitGetPlanFile = (fileName: string) => {
  emit("getPlanFile", fileName);
};

watch(
  () => config.uacenv.value,
  () => {
    const cfg = config.getEnvironment();
    console.log("watch config.uacenv ", cfg.planDir);
    fetchData();
  }
);

onMounted(() => {
  console.log(`FileComponent.onMounted: port: ${port}, host: ${host}`);
  fetchData()  // Fetch the data for the initial directory when the component is mounted
    .then(() => {

      ws = new WebSocket(`ws://${host}:${port}`);
      ws.addEventListener("message", (msEvent) => {
        const parsedEvent = JSON.parse(msEvent.data);
        console.log(`addEventListener ${JSON.stringify(parsedEvent)}`);
        if (parsedEvent?.status !== 404) fetchData();
        if (parsedEvent.error)
        Swal.fire(parsedEvent.error.message, parsedEvent.error.detail, "error");
      });

      // For at starte overvågning
      ws.addEventListener("open", () => {
        ws.send(JSON.stringify({ action: "watch", path: config.getPlanDir() }));
      });
    });
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
  }
});

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