<template>
  <div v-if="state.isConfigLoaded">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { config } from "./store/config";
import { state } from "./store/state";

onMounted(() => {
  config.init()
    .then(() => {
      state.isConfigLoaded = true;
    });
})

</script>
<style lang="scss"></style>
