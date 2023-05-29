<template>
  <table role="presentation" id="isc_7GZ" cellspacing="0" cellpadding="3" border="0">
    <colgroup>
      <col width="225" />
      <col width="226" />
    </colgroup>
    <tbody>
      <tr>
        <td class="ucFormSectionLabelBold" style="padding: 5px" align="left" valign="middle">
          Linux/Unix Details
        </td>
      </tr>
      <tr>
        <td style="
                margin: 0px;
                border: 0px;
                padding: 0px;
                background-image: none;
                background-color: transparent;
                -webkit-box-shadow: none;
                box-shadow: none;
                font-size: 0px;
                height: 0px;
                overflow: hidden;
                padding: 0px;
              " class=""></td>
        <td style="
                margin: 0px;
                border: 0px;
                padding: 0px;
                background-image: none;
                background-color: transparent;
                -webkit-box-shadow: none;
                box-shadow: none;
                font-size: 0px;
                height: 0px;
                overflow: hidden;
                padding: 0px;
              " class="">
          <div style="overflow: hidden; height: 0px"></div>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" id="isc_7HL">
          <span id="isc_7HM" style="display: inline-block" class="formTitle" align="left">
            <label id="isc_7HN">Command or Script</label> </span><br />
          <table role="presentation" id="isc_7HP" cellpadding="0" cellspacing="0" style="cursor: default; width: 294px"
            class="selectItemLiteControl">
            <tbody>
              <tr>
                <td style="
                        margin: 0px;
                        border: 0px;
                        padding: 0px;
                        background-image: none;
                        background-color: transparent;
                        -webkit-box-shadow: none;
                        box-shadow: none;
                      ">
                  <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
                    autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px"
                    tabindex="3325">
                    {{ taskNode.commandOrScript }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" colspan="2" id="isc_7HT">
          <div>
            <span id="isc_7HU" style="display: inline-block" class="formTitle" align="left">
              <label id="isc_7HW" for="isc_7HV">Command</label>&nbsp;
              <span style="color: red">*</span> </span><br />
            <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
              autocomplete="OFF" class="selectItemLiteText uc-field"
              style="width: 262px; height: 16px; width: 423px; height: 40px" tabindex="3325">
              {{ taskNode.command }}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" colspan="2" id="isc_7HX">
          <div>
            <span id="isc_7HY" style="display: inline-block" class="formTitle" align="left"><label id="isc_7I0"
                for="isc_7HZ">Parameters</label></span><br />
            <div v-show="show" class="popup">Opdateret</div>
            <div style="display: flex; align: center">
              <input type="TEXT" name="credentials" id="paramField" autocomplete="OFF" class="uc-field"
                style="width: 262px; height: 16px; width: 423px; height: 40px" tabindex="3325" ref="paramField"
                @keyup.enter="updateParameters" v-model="parameters" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" colspan="2" id="isc_7I1">
          <span id="isc_7I2" style="display: inline-block" class="formTitle" align="left"><label id="isc_7I4"
              for="isc_7I3">Runtime Directory</label></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field"
            style="width: 262px; height: 16px; width: 423px; height: 40px" tabindex="3325">
            {{ taskNode.runtimeDir }}
          </span>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" colspan="2" id="isc_7I5">
          <span id="isc_7I6" style="display: inline-block" class="formTitle" align="left"><label id="isc_7I7">Environment
              Variables</label></span><br />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { api } from "@/api/api";
import { TaskUnix } from "@/types/interfaces";
import { defineProps, onMounted, ref } from 'vue';
import { watchEffect } from 'vue';

const props = defineProps({
  taskNode: {
    type: Object as () => TaskUnix,
    default: () => {
      return {} as TaskUnix;
    },
  }
});
const parameters = ref(props.taskNode.parameters);
const show = ref(false);

const updateParameters = async () => {
  console.log("Parameter updated:", parameters.value);
  const elem = document.getElementById("paramField");
  if (elem) elem.blur();
  const paramObj = {
    sysId: props.taskNode.sysId,
    name: props.taskNode.name,
    type: props.taskNode.type,
    agent: props.taskNode.agent,
    command: props.taskNode.command,
    exitCodes: props.taskNode.exitCodes,
    parameters: parameters.value
  };
  await api.updateTask(paramObj);
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, 2000);
};
onMounted(() => {
  console.log("TaskUnixComponent.onMounted: ", props.taskNode.name);
});

watchEffect(() => {
  console.log('taskNode changed:', props.taskNode);
  parameters.value = props.taskNode.parameters;
});
</script>

<style>
.popup {
  opacity: 1;
  transition: opacity 2s linear;
  background-color: light-green;
  display: inline-block;
  font-size: 1.2em;
  vertical-align: right;
}

.popup[style*="display: none"] {
  opacity: 0;
}
</style>