<template>
  <li v-if="item" @click.stop="fileClicked">
    <span v-if="item.type === 'folder'">📁</span>
    <span v-if="item.type === 'file'">📄</span>
    <!--
    <span @contextmenu.prevent="openContextMenu" @click="closeContextMenu" ref="contextElement">{{ item.name }}
      <div v-if="showContextMenu" :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }" class="context-menu">
        <button @click="handleMenuClick('Option 1')">Slet fil</button>
      </div>
    </span>
        ... @keydown.delete="onDelete" />
    -->
    <span class="fileItem">{{ item.name }}</span>
    <ul v-if="item.children && item.children.length">
      <file-item v-for="child in item.children" :key="child.name" :item="child" @file-clicked="emitFileClicked" />
      <div style="padding-top: 3px;">
        <input v-show="item.type === 'folder' && addNewFile" type="text" v-model="fileName" @keyup.enter="onEnter" />
      </div>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { api } from '@/api/api';
import Swal from 'sweetalert2';
import { defineProps, defineEmits, ref } from 'vue';

interface Item {
  name: string;
  path: string;
  type: string;
  children?: Item[];
}

let addNewFile = ref(false);
let fileName = ref("");
const props = defineProps({
  item: Object as () => Item,
});

const emit = defineEmits(['file-clicked']);
/*
const fileClicked = () => {
  if (props?.item && props.item.type === 'file') {
    console.log("Pick: ", props.item.path)
    emit('file-clicked', props.item.path);
  }
}
*/

let clickCount = 0;
let timer: number | null = null;

const fileClicked = () => {
  clickCount++;
  console.log("click: ", clickCount);
  if (clickCount === 1) {
    timer = setTimeout(() => {
      if (props?.item && props.item.type === 'file') {
        console.log("Pick: ", props.item.path);
        emit('file-clicked', props.item.path);
      } else if (props?.item && props.item.type === 'folder') {
        console.log("Pick folder: ", props.item.path);
        console.log("addNewFile");
        addNewFile.value = true;
      }
      resetClick();
    }, 300); // Debounce time
  } else if (clickCount === 2) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (props?.item && props.item.type === 'file') {
      console.log("Double click: ", props.item.path);
      api.startEditor(props.item.path);
    }
    resetClick();
  }
}

const resetClick = () => {
  clickCount = 0;
}

const emitFileClicked = (filePath: string) => {
  emit('file-clicked', filePath);
}


const onEnter = () => {
  if (fileName.value) {
    if (props?.item) {
      const file = `${props.item.path}\\${fileName.value}`;
      console.log
      api.startEditor(file);
    }

    fileName.value = '';
    addNewFile.value = false;
  }
}
/*
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);

const openContextMenu = (event: any) => {
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenu.value = true;
};

const closeContextMenu = () => {
  showContextMenu.value = false;
};

const handleMenuClick = (option: string) => {
  console.log('You clicked:', option);
  closeContextMenu();
};

const onDelete = () => {
  if (fileName.value) {
    Swal.fire({
      title: 'Slet fil?',
      text: `Ønsker du at slette ${fileName.value}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, slet den!',
      cancelButtonText: 'Nej, behold den'
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (props?.item) {
          const file = `${props.item.path}\\${fileName.value}`;
          console.log
          api.delete(file);
        }
      }

      fileName.value = '';
      addNewFile.value = false;
    });
  }
}
*/

</script>

<style>
.fileItem {
  cursor: pointer;
}

.fileItem:hover {
  background-color: #ddd;
}
</style>