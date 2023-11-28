<!--
  FILEPATH: h:\projekter\wkfexplorer\explorer\src\components\explorer\TreeComponent.vue
  Description: This component is responsible for rendering a tree structure of tasks and workflows.
  Props:
    - treeData: An array of TreeNode objects representing the tree structure to be rendered.
  Emits:
    - currentNodeEvent: An event emitted when a task node is clicked. It passes the name of the clicked node as a string.
  Methods:
    - handleTaskClick: A method that handles the click event on a task node. It logs the clicked node to the console and emits the currentNodeEvent event.
    - handleCurrentNodeEvent: A method that handles the currentNodeEvent event. It logs the name of the clicked node to the console and emits the currentNodeEvent event.
    - openNode: A method that sets the isVisible property of a node to true.
    - handleClick: A method that handles the click event on a workflow node. It toggles the visibility of the node and its children.
    - isWorkflow: A method that returns true if the given node is a workflow node.
    - closeSubtree: A recursive method that sets the isVisible property of a node and its children to false.
    - toggleVisibility: A method that toggles the visibility of a node and its children.
-->
<template>
  <ul>
    <li v-for="(node, index) in treeData" :key="index" class="treeList">
      <div v-if="node.type === 'taskWorkflow'">
        <span @click="handleClick(node)" style="background-color: white; cursor: pointer;"
          :class="node.workflow.length > 0 ? 'workflow' : 'wkfempty'">
          {{ node.name }}</span>

        <TreeComponent v-if="isWorkflow(node)" v-show="node.isVisible" @open="openNode(node)"
          @currentNodeEvent="handleCurrentNodeEvent" :treeData="node.workflow" :parmItems="parmItems">
        </TreeComponent>
      </div>
      <div v-else-if="node.type === 'taskUnix'">
        <span @click="handleTaskClick(node)" style="cursor: pointer"> {{ node.name }}</span>
        <span v-if="node.comment" class="comment"> ({{ node.comment }}) </span>
        <div v-for="(item, itemIndex) in filterTasksByPattern(node.name)" :key="itemIndex" class="no-padding.margin">
          <span  class="indent">
            {{ item.task }} = {{ item.parameter }}
          </span>
        </div>
        <!--
        <pre v-if="filterTasksByPattern(node.name).length > 0"  class="no-padding-margin"><span v-for="(item, itemIndex) in filterTasksByPattern(node.name)" :key="itemIndex" class="no-padding.margin"> {{ item.task }} = {{ item.parameter }} </span> </pre>
        -->
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from "vue";
import { ParmItem, TreeNode } from "@/types/interfaces";
const props = defineProps({
  treeData: {
    type: Array as () => TreeNode[],
    default: () => { return [] as TreeNode[] }
  },
  parmItems: {
    type: Array as () => ParmItem[],
    default: () => { return [] as ParmItem[] }
  }
})
const parmItems = ref(props.parmItems);

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

const handleClick = (node: TreeNode) => {
  if (node.type === "taskWorkflow") {
    toggleVisibility(node);
  }
};

const isWorkflow = (elem: TreeNode) => {
  return elem.type === "taskWorkflow";
};

function filterTasksByPattern(pattern: string) {
  // console.log("parmItems", props.parmItems);
  // console.log("filterTasksByPattern", pattern);

  const matchingTasks = props.parmItems.filter(item => {
    const regex = new RegExp(`${pattern}_step\\d{3}$`);
    return regex.test(item.task);
  });
  // console.log("matchingTasks", matchingTasks);
  return matchingTasks;
  // return matchingTasks.map(item => item.task);
}
/*
function filterTasksByPattern(parmItems: ParmItem[], pattern: string): string[] {
  const regex = new RegExp(`${pattern}_step\\d{3}$`);
  const matchingTasks = parmItems
    .filter((item) => regex.test(item.task))
    .map((item) => item.task);
  return matchingTasks;
}
*/

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

.comment {
  font-size: smaller;
  color: #555;
  padding-left: 20px;
}

.no-padding-margin {
  margin: 0;
  padding: 0;
}
.indent {
  margin-left: 20px; /* Juster dette tal efter behov */
}

</style>
