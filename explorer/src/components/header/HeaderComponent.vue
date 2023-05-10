<template>
  <div
    class="header"
    :style="{ backgroundColor: color }"
    style="height: 100%; border: 1px solid black"
  >
    <h3>Workflow explorer</h3>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import config from "@/store/config";

export default defineComponent({
  setup() {
    let color = computed(() => config.getBackgroundColor());

    onBeforeMount(() => {
      console.log("HeaderComponent.onBeforeMount: ", color.value);
    });
    return { color };
  },
});
</script>

<style scoped>
.header {
  width: 100%;
  height: 100%;
}
</style>