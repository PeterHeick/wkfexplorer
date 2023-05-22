<template>
  <div v-if="isLoaded">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef } from "vue";
import { config } from "./store/config";


export default defineComponent({
  setup() {
    let isLoaded = ref(false);

    onMounted(() => {
      config.init()
        .then(() => {
          isLoaded.value = true;
        });
    })
    return {isLoaded};
  }
})
</script>
<style lang="scss"></style>
