<template>
  <li v-if="item" @click="fileClicked" style="cursor: pointer;">
    <span v-if="item.type === 'folder'">📁</span>
    <span v-if="item.type === 'file'">📄</span>
    <span >{{ item.name }}</span>
    <ul v-if="item.children && item.children.length">
      <file-item v-for="child in item.children" :key="child.name" :item="child" @file-clicked="emitFileClicked" />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

interface Item {
  name: string;
  path: string;
  type: string;
  children?: Item[];
}

const props = defineProps({
  item: Object as () => Item,
});

const emit = defineEmits(['file-clicked']);

const fileClicked = () => {
  if (props?.item && props.item.type === 'file') {
    console.log("Pick: ", props.item.path)
    emit('file-clicked', props.item.path);
  }
}


const emitFileClicked = (filePath: string) => {
  emit('file-clicked', filePath);
}
</script>