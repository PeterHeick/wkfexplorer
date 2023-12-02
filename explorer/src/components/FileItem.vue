<template>
    <li v-if="item" @click.stop="fileClicked" >
      <span v-if="item.type === 'folder'" @click.stop="toggleFolder">📁</span>
      <span v-if="item.type === 'file'">📄</span>
      <span class="fileItem">{{ item.name.split('\.')[0] }}</span>
      <ul v-if="item.children && isFolderOpen">
        <file-item v-for="child in item.children" :key="child.name" :item="child" @getPlanFile="emitGetPlanFile" />
        <!--
        <div style="padding-top: 3px">
          <input ref="inputField" v-show="item.type === 'folder' && addNewFile" type="text" v-model="fileName"
            @keyup.enter="onEnter" @blur="addNewFile = false" />
        </div>
        -->
      </ul>
    </li>
  </template>
  
  <script  lang="ts"  setup>
  import { api } from "@/api/api";
  import Swal from "sweetalert2";
  import { defineProps, defineEmits, ref, nextTick, watch } from "vue";
  
  interface Item {
    name: string;
    path: string;
    type: string;
    children?: Item[];
  }
  
  // let addNewFile = ref(false);
  let fileName = ref("");
  // const inputField = ref(null as HTMLInputElement | null);
  const props = defineProps({
    item: Object as () => Item,
  });
  
  const emit = defineEmits(["getPlanFile"]);
  let clickCount = 0;
  let timer: number | null = null;
  let isFolderOpen = ref(false);
  
  const fileClicked = () => {
    clickCount++;
    console.log("click: ", clickCount);
    if (clickCount === 1) {
      timer = setTimeout(() => {
        if (props?.item && props.item.type === "file") {
          console.log("Pick: ", props.item.path);
          emitGetPlanFile(props.item.path);
        // } else if (props?.item && props.item.type === "folder") {
        //   console.log("Pick folder: ", props.item.path);
          // addNewFile.value = true;
        }
        resetClick();
      }, 300); // Debounce time
    } else if (clickCount === 2) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (props?.item && props.item.type === "file") {
        console.log("Double click: ", props.item.path);
        api.startEditor(props.item.path)
          .then((response: Response) => {
            console.log(`StartEditor: ${response.status}`);
            if (response.status === 203) {
              return response.json()
            } else {
              return null;
            }
          })
          .then((msg: { message: string; detail: string }) => {
            if (msg) {
              console.log(JSON.stringify(msg));
              Swal.fire( msg.message , "", "info");
            } 
          });
      }
      resetClick();
    }
  };
  
  const resetClick = () => {
    clickCount = 0;
  };
  
  const emitGetPlanFile = (filePath: string) => {
    console.log(`emitGetPlanFile: ${filePath}`);
    emit("getPlanFile", filePath);
  };
  
  const toggleFolder = () => {
    // Toggle tilstanden for om folderen er åben eller lukket
    isFolderOpen.value = !isFolderOpen.value;
  };
  
  const onEnter = () => {
    if (fileName.value) {
      if (props?.item) {
        const file = `${props.item.path}\\${fileName.value}`;
        api.startEditor(file);
      }
  
      fileName.value = "";
      // addNewFile.value = false;
    }
  };
  
  /*
  nextTick er en metode i Vue, der anvendes til at vente på, at DOM-opdateringerne er færdige.
  Den sikrer, at den kode, der er indesluttet i nextTick, kun eksekveres efter, at Vue's reaktive system har opdateret DOM'en
  watch(addNewFile, (newValue) => {
    if (newValue) {
      nextTick(() => {
        if (inputField?.value) {
          inputField.value.focus();
        }
      });
    }
  });
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
  