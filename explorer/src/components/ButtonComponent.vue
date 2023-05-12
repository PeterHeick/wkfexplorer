<template>
  <button><slot></slot></button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style>
button {
  width: 110px;
  background-color: #ddd;
  font-size: small;
  border-radius: 4px;
  height: 25px;
  cursor: pointer;
  margin-right: 10px;
}
</style>