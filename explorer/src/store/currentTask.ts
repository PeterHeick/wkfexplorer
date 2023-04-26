// src/store.ts
import { reactive } from 'vue';

/*
  Den her bruges til at holde styr på current task i TreeComponent.
  Task skal kun vises når det er den aktuelle current task.
  Så den her opdateres fra TreeComponent.
*/

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
