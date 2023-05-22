<template>
  <ul>
    <li v-for="(node, index) in treeData" :key="index" class="treeList">
      <div v-if="node.type === 'taskWorkflow'">
        <span @click="handleClick(node)" :style="{ backgroundColor: 'white' }"
          :class="node.workflow.length > 0 ? 'workflow' : 'wkfempty'">
          {{ node.name }}</span>
        <TreeComponent v-if="isWorkflow(node)" v-show="node.isVisible" @open="openNode(node)"
          @currentNodeEvent="handleCurrentNodeEvent" :treeData="node.workflow" :currentTask="currentTask">
        </TreeComponent>
      </div>
      <div v-else-if="node.type === 'taskUnix'">
        <span @click="handleTaskClick(node)"> {{ node.name }}</span>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted } from "vue";
import { TreeNode } from "@/types/interfaces";
import { currentTask } from "@/store/currentTask";

/*
props: {
  treeData: {
    type: Array as () => TreeNode[],
    default: () => {
      return [] as TreeNode[];
    },
  }
},
*/
defineProps({ treeData: { type: Array as () => TreeNode[], default: () => { return [] as TreeNode[] } } })
const emit = defineEmits(["currentNodeEvent"])

const handleTaskClick = (node: TreeNode) => {
  console.log("HandleTaskClick TreeComponent ", JSON.stringify(node));
  emit("currentNodeEvent", node.name);
};

const handleCurrentNodeEvent = (name: string) => {
  console.log("HandleCurrentNodeEvent ", name);
  emit("currentNodeEvent", name);
}

const openNode = (node: TreeNode) => {
  if (node.isVisible) {
    return;
  }
  node.isVisible = true;
};

const visible = (node: TreeNode) => {
  return node.name === currentTask.getTask();
};

const handleClick = (node: TreeNode) => {
  if (node.type === "taskWorkflow") {
    toggleVisibility(node);
  }
};

const isWorkflow = (elem: TreeNode) => {
  return elem.type === "taskWorkflow";
};

onMounted(() => {
  console.log("TreeComponent ");
})


function closeSubtree(node: TreeNode) {
  node.isVisible = false;
  if (node.type === "taskWorkflow") {
    for (const e of node.workflow) {
      closeSubtree(e);
    }
  }
}
function toggleVisibility(node: TreeNode) {
  console.log("toggleVisibility");
  if (node.isVisible) {
    closeSubtree(node);
  } else {
    node.isVisible = true;
  }
  console.log(node.isVisible ? "Visible" : "Not visible");
}
</script>

<style>
.treeList {
  list-style-type: none;
  margin-left: 0px;
}

.workflow {
  font-weight: bold;
}

.wkfempty {
  font-weight: 500;
}
</style>