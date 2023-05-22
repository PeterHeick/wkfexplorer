<template>
  <button class="buttoncmp" type="button" :disabled="disable"><slot></slot></button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({ disable: Boolean });

</script>

<style>
.buttoncmp {
  width: 110px;
  background-color: #e6e6e6;;
  font-size: small;
  border-radius: 4px;
  height: 21.1667px;
  cursor: pointer;
  margin-right: 10px;
}
button:hover {
  background-color: #ddd;
}
</style>