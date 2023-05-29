<template>
  <div>
    <input type="file" @click="handleClick" @change="handleFile" ref="fileInput" />
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(["planRead"]);
let file: File;
const fileInput = ref<HTMLInputElement | null>(null);

const handleClick = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

const handleFile = (event: any) => {
  file = event.target.files[0];
  console.log("picked ", file.name);
  emit("planRead", file.name);
};

</script>

