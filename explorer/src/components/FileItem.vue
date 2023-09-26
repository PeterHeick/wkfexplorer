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
      <file-item
        v-for="child in item.children"
        :key="child.name"
        :item="child"
        @file-clicked="emitFileClicked"
        @editorFinished="emitEditorFinished"
        @keydown="handleKeydown"
      />
      <div style="padding-top: 3px">
        <input
          v-show="item.type === 'folder' && addNewFile"
          type="text"
          v-model="fileName"
          @keyup.enter="onEnter"
        />
      </div>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { api } from "@/api/api";
import Swal from "sweetalert2";
import { defineProps, defineEmits, ref } from "vue";
import { config } from "@/store/config";

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

const emit = defineEmits(["file-clicked", "editorFinished"]);

let clickCount = 0;
let timer: number | null = null;

const fileClicked = () => {
  clickCount++;
  console.log("click: ", clickCount);
  if (clickCount === 1) {
    timer = setTimeout(() => {
      if (props?.item && props.item.type === 'file') {
        console.log("Pick: ", props.item.path);
        emitFileClicked(props.item.path);
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
      api.startEditor(props.item.path).then(() => {
        if (props?.item && props.item.type === 'file') {
          console.log(`Editor finished: ${props.item.path}`);
          emitEditorFinished();
        }
      });
    }
    resetClick();
  }
};

const resetClick = () => {
  clickCount = 0;
};

const emitFileClicked = (filePath: string) => {
  console.log(`emitFileClicked: ${filePath}`);
  emit("file-clicked", filePath);
};

const emitEditorFinished = () => {
  console.log(`emitEditorFinished ${config.getPlanDir()}`);
  emit("editorFinished", config.getPlanDir());
};

const onEnter = () => {
  if (fileName.value) {
    if (props?.item) {
      const file = `${props.item.path}\\${fileName.value}`;
      api.startEditor(file).then(() => emitEditorFinished());
    }

    fileName.value = '';
    addNewFile.value = false;
  }
};

// Virker ikke den fanger ikke keyDown, der gøres ikke mere ved det med mindre driften ønsker delete file
const handleKeydown = async (event: { key: string }) => {
  console.log("Keydown");
  if (event.key === "Delete" && props?.item) {
    console.log("Delete Key");
    deleteFile(props.item.path);
  }
};

// Virker ikke
// Er ikke implementeret færdig, driften ønsker ikke flere rettelser
const deleteFile = async (file: string) => {
  console.log("delete file()");
  const result = await Swal.fire({
    title: "Er du sikker?",
    text: "Filen vil blive slettet permanent",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ja, slet den!",
    cancelButtonText: "Nej, annuller!",
  });

  if (result.isConfirmed) {
    // Kode for at slette filen
    // ...
    api.delete(file);

    Swal.fire("Slettet!", "Din fil er blevet slettet.", "success");
  }
};
</script>

<style>
.fileItem {
  cursor: pointer;
}

.fileItem:hover {
  background-color: #ddd;
}
</style>