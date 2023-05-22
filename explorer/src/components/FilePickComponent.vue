<template>
  <div>
    <input type="file" @change="handleFile" ref="fileInput"/>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(["planEvent"]);
let file: File;
const fileInput = ref<HTMLInputElement | null>(null);

const handleFile = (event: any) => {
  file = event.target.files[0];
  console.log("picked ", file.name);
  emit("planEvent", file.name);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

</script>

