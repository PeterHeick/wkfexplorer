<template>
  <button @click="handleClick" class="buttoncmp" type="button" :disabled="isDisabled">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { state } from "@/store/state";
import { computed, defineEmits, defineProps } from 'vue';

const isDisabled = computed(() => {
  // console.log("ButtonComponent plan read: ", state.isPlanRead);
  // console.log(props.disable,  !state.isWkfLoaded, state.planUpdateInProgress);
  return props.disable || !state.isWkfLoaded || state.planUpdateInProgress
})

const emit = defineEmits(["buttonClicked"]);
const props = defineProps({disable: Boolean});

const handleClick = () => {
  emit("buttonClicked", "");
}

</script>

<style>
.buttoncmp {
  width: 110px;
  background-color: #e6e6e6;
  ;
  font-size: small;
  border-radius: 4px;
  height: 21.1667px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #ddd;
}</style>