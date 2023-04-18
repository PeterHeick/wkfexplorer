<template>
  <div v-if="taskNode.name === shownNode">
    <table role="presentation" cellspacing="0" cellpadding="3" border="0">
      <colgroup>
        <col width="305" />
        <col width="306" />
      </colgroup>
      <tbody>
        <tr>
          <td
            class="ucFormSectionLabelBold"
            style="padding: 5px"
            align="left"
            valign="middle"
          >
            General
          </td>
        </tr>
        <tr>
          <td align="left" valign="top">
            <span id="isc_X6" class="formTitle" align="left">
              <label id="isc_X8" for="isc_X7"> Name </label>&nbsp;
              <span style="color: red">*</span>
            </span>
            <br />
            <span id="td-name" class="text">{{ taskNode.name }}</span>
          </td>
          <td align="left" valign="top">
            <span align="left">
              <label id="isc_183">Version</label>
            </span>
            <br />
            <span id="td-version" class="text">{{ taskNode.version }}</span>
          </td>
        </tr>
        <tr>
          <td align="left" valign="top" colspan="2">
            <span id="isc_XA" class="formTitle" align="left">
              <label id="isc_XC" for="isc_XB"> Description</label>
            </span>
            <br />
            <span id="td-description" class="text">
              {{ taskNode.summary }}
            </span>
          </td>
        </tr>
        <tr>
          <td align="left" valign="top" colspan="2">
            <span id="isc_XE" class="formTitle" align="left">
              <label id="isc_XF"> Member of Business Services</label>
            </span>
            <br />
            <span
              class="text"
              v-for="(bs, index) in taskNode.opswiseGroups"
              :key="index"
              > {{ bs }} </span
            >
          </td>
        </tr>
      </tbody>
    </table>
    <TaskUnixComponent :taskNode="taskNode"></TaskUnixComponent>
  </div>
</template>
<script lang="ts">
import { ItreeNode } from "@/types/interfaces";
import { defineComponent } from "vue";
import TaskUnixComponent from "./TaskUnixComponent.vue";

export default defineComponent({
  components: { TaskUnixComponent },
  props: {
    taskNode: {
      type: Object as () => ItreeNode,
      default: () => {
        return {} as ItreeNode;
      },
    },
    shownNode: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>
