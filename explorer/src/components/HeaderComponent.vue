<template>
  <div class="header" :style="{ backgroundColor: color }">
    <div class="flex-container">
      <div class="buttons left">
        <router-link to="/" @click="handleClick">
          <ButtonComponent>Workflows</ButtonComponent>
        </router-link>
      </div>
      <h3 class="center">
        <slot></slot>
        <br/>
        <span style="font-size: small">{{ message }}</span>
      </h3>
      <div class="buttons right">
        <router-link to="/plan" @click="handleClick">
          <ButtonComponent>Plan</ButtonComponent>
        </router-link>
      </div>
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
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  flex: 1;
  padding: 30px;
}

.center {
  flex: 2;
  text-align: center;
}

.right {
  flex: 1;
  text-align: right;
  padding-right: 30px;
}

</style>