// src/store.ts
import { reactive } from 'vue';

// export const currentTask = reactive({
//   selectedElement: "",
// });

export const currentTask = reactive({
  selectedElement: "",
  selectedId: 0,

  getId() {
    console.log("getId: ", this.selectedId);
    return this.selectedId;
  },

  setId(id: number) {
    console.log("setId: ", id);
    this.selectedId = id;
  },

  getTask() {
    console.log("getTask: ", this.selectedElement);
    return this.selectedElement
  },

  setTask(elem: string) {
    console.log("setTask: ", elem);
    this.selectedElement = elem;
  },

  getTelePort() {
    const elem = document.getElementById("middle");
    console.log("getTelePort: ", elem?.innerHTML);
    return document.getElementById("middle")
  },

});
