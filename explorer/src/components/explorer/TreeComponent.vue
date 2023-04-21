<template>
  <ul>
    <li v-for="(node, index) in treeData" :key="index" class="my-list">
      <div v-if="node.type === 'taskWorkflow'">
        <span
          @click="handleClick(node)"
          :style="{ backgroundColor: node.color }"
        >
          -{{ node.name }}</span
        >
        <TreeComponent
          v-if="isWorkflow(node)"
          v-show="node.isVisible"
          @open="openNode(node)"
          :treeData="node.workflow"
          :currentTask="currentTask"
        >
        </TreeComponent>
      </div>
      <div v-else-if="node.type === 'taskUnix'">
        <span @click="handleTaskClick(node)"> {{ node.name }}</span>
        <teleport to="#middle">
          <TaskComponent
            :taskNode="node"
            :shownNode="shownNode"
            v-show="visible(node)"
          >
          </TaskComponent>
        </teleport>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ItreeNode } from "@/types/interfaces";
import TaskComponent from "./tasks/TaskComponent.vue";
import { currentTask } from "@/store/currentTask";

function closeSubtree(node: ItreeNode) {
  node.isVisible = false;
  if (node.type === "taskWorkflow") {
    for (const e of node.workflow) {
      closeSubtree(e);
    }
  }
}
function toggleVisibility(node: ItreeNode) {
  console.log("toggleVisibility");
  if (node.isVisible) {
    closeSubtree(node);
  } else {
    node.isVisible = true;
  }
  console.log(node.isVisible ? "Visible" : "Not visible");
}

export default defineComponent({
  name: "TreeComponent",
  components: { TaskComponent },
  props: {
    treeData: {
      type: Array as () => ItreeNode[],
      default: () => {
        return [] as ItreeNode[];
      },
    },
    /*  Props benyttes kun når man importerer data ikke når de eksporteres
    taskNode:
    {
      type: Object as () => ItreeNode,
      default: () => { return {} as ItreeNode }
    },
    */
  },
  setup() {
    var shownNode = ref("");

    const handleTaskClick = (node: ItreeNode) => {
      shownNode.value = node.name;
      currentTask.setTask(node.name);
      console.log("handleTaskClick", currentTask.getTask());
    };

    const openNode = (node: ItreeNode) => {
      if (node.isVisible) {
        return;
      }
      node.isVisible = true;
    };

    const visible = (node: ItreeNode) => {
      return node.name === currentTask.getTask();
    };

    const handleClick = (node: ItreeNode) => {
      if (node.type === "taskWorkflow") {
        toggleVisibility(node);
      } else {
        if (node.type === "taskUnix") {
          // this.$emit('update:taskNode', node)
        }
      }
    };

    const isTask = (elem: ItreeNode) => {
      return elem.type === "taskUnix";
    };

    const isWorkflow = (elem: ItreeNode) => {
      return elem.type === "taskWorkflow";
    };

    return {
      handleClick,
      isWorkflow,
      isTask,
      handleTaskClick,
      openNode,
      shownNode,
      currentTask,
      visible,
    };
  },
});
</script>

<style>
.my-list {
  list-style-type: none;
  margin-left: 0px;
}
</style>