
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
        >
        </TreeComponent>
      </div>
      <div v-else-if="node.type === 'taskUnix'">
        <span @click="handleTaskClick(node)"> {{ node.name }}</span>
        <teleport to="#middle" v-if="selectedNode">
          <TaskComponent :taskNode="node" :shownNode="shownNode">
          </TaskComponent>
        </teleport>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import { ItreeNode } from "@/types/interfaces";
import TaskComponent from "./tasks/TaskComponent.vue";

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
    // argument props her, hvis props skal bruges i setup
    var shownNode = ref(""); // den her skal være reaktiv, for at blive vist i taskComponent
    //var selectedNode: Ref<ItreeNode | null> = ref(null);
    var selectedNode: any = ref(null);

    const handleTaskClick = (node: ItreeNode) => {
      shownNode.value = node.name;
      selectedNode.value = node;
      console.log("handleTaskClick", shownNode.value, node.name);
      console.log(node.opswiseGroups);
      console.log(`node visible: ${node.isVisible}`);
    };

    const openNode = (node: ItreeNode) => {
      if (node.isVisible) {
        return;
      }
      node.isVisible = true;
      // $emit('open');
    };

    const handleClick = (node: ItreeNode) => {
      if (node.type === "taskWorkflow") {
        toggleVisibility(node);
      } else {
        if (node.type === "taskUnix") {
          // this.$emit('update:taskNode', node)
        }
      }
      //console.log(this.taskNode.name);
    };

    const selectedTaskNode = computed(() => {
      if (selectedNode) {
        console.log('selectedTaskNode: ', selectedNode.value.name);
        return selectedNode.value;
      } else {
        return null;
      }
    });

    const isTask = (elem: ItreeNode) => {
      return elem.type === "taskUnix";
    };

    const isWorkflow = (elem: ItreeNode) => {
      return elem.type === "taskWorkflow";
    };

    /*
    const handleChange = (newVal: any, oldVal: any) => {
      console.log(`Changed in TreeComponent ${oldVal.name} to ${newVal.name}`);
    }
    */
    return {
      handleClick,
      isWorkflow,
      isTask,
      handleTaskClick,
      openNode,
      shownNode,
      selectedNode,
      selectedTaskNode
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