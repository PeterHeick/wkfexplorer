<template>
  <div class="header" :style="{ backgroundColor: color }">
    <h3>
      <slot></slot>
      <br/>
      <span style="font-size: small">{{ message }}</span>
    </h3>
    <div class="buttons">
      <router-link to="/" @click="handleClick">
        <ButtonComponent>Workflows</ButtonComponent>
      </router-link>

      <router-link to="/plan" @click="handleClick">
        <ButtonComponent>Plan</ButtonComponent>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, defineProps, ref } from "vue";
import { config } from "@/store/config";
import { state } from "@/store/state";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { api } from "@/api/api";
import { version } from "../../../version.json";

defineProps({ message: String });
let color = computed(() => config.getBackgroundColor());
const message = ref("");

const disable = computed(() => {
  return !state.isWkfLoaded || !state.isPlanRead || state.planUpdateInProgress
});

const handleClick = ((event: any) => {
  if (disable.value) {
    event.preventDefault;
  }
})

const updateVersion = async () => {
  console.log("Get version");
  const v = await api.getVersion();
  console.log(v);
  const vdata = await v.json();
  console.log(vdata);
  console.log(JSON.stringify(vdata));
  message.value = "";
  if (v.ok) {
    console.log(`version: ${vdata.version} explorerV: ${version}`);
    console.log(`version: ${typeof vdata.version} explorerV: ${typeof version}`);
    if (vdata.version !== version) {
      message.value = `Version mismatch: server: ${vdata.version}, client: ${version}`;
    }
  }

}
onBeforeMount(() => {
  console.log("HeaderComponent.onBeforeMount: ", color.value);
  updateVersion();
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