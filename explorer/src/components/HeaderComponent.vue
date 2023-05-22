<template>
  <div class="header" :style="{ backgroundColor: color }">
    <h3>
      <slot></slot>
    </h3>
    <div class="buttons">
      <router-link to="/">
        <ButtonComponent class="right">Workflows</ButtonComponent>
      </router-link>

      <router-link to="/plan">
        <ButtonComponent>Plan</ButtonComponent>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { config } from "@/store/config";
import ButtonComponent from "@/components/ButtonComponent.vue";

let color = computed(() => config.getBackgroundColor());

onBeforeMount(() => {
  console.log("HeaderComponent.onBeforeMount: ", color.value);

});
</script>

<style scoped>
.header {
  display: flex;
  height: 50px;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  padding-top: 10px;
  overflow: visible;
  cursor: default;
  border: 2px solid grey;
}

h3 {
  padding-left: 10px;
}

.buttons {
  display: flex;
  align-items: center;
}
</style>