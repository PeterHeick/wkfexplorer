<template>
  <table role="presentation" id="isc_2LU" cellspacing="0" cellpadding="3" border="0">
    <colgroup>
      <col width="320" />
      <col width="321" />
    </colgroup>
    <tbody>
      <tr>
        <td class="ucFormSectionLabelBold" style="padding: 5px" align="left" valign="middle">
          File Transfer Details
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
          " class="">
          <div style="overflow: hidden; height: 0px"></div>
        </td>
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
        <td align="left" valign="top" class="formCell" style="" id="isc_2LV" aria-expanded="false">
          <span id="isc_2LW" style="display: inline-block" class="formTitle" align="left"><label id="isc_2LX">Transfer
              Protocol</label></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.serverType }}
          </span>
        </td>
        <td align="left" valign="top" class="formCell" style="" id="isc_2WY">
          <span id="isc_2WZ" style="display: inline-block" class="formTitle" align="left"><label
              id="isc_2X0">Command</label></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.command }}
          </span>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" id="isc_2NV">
          <span id="isc_2NW" style="display: inline-block" class="formTitle" align="left"><label id="isc_2NX">Transfer
              Type</label></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.format }}
          </span>
        </td>
        <td align="left" valign="top" class="formCell" style="" id="isc_2X6">
          <span id="isc_2X7" style="display: inline-block" class="formTitle" align="left"><label id="isc_2X8">Transfer
              Mode</label></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.transferMode }}
          </span>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" id="isc_2XE">
          <span id="isc_2XF" style="display: inline-block" class="formTitle" align="left"><label id="isc_2XH"
              for="isc_2XG">Remote Server</label>&nbsp;<span style="color: red">*</span></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.remoteServer }}
          </span>
        </td>
        <td align="left" valign="top" class="formCell" style="" id="isc_2XI">
          <span id="isc_2XJ" style="display: inline-block" class="formTitle" align="left"><label id="isc_2XL"
              for="isc_2XK">FTP Credentials</label>&nbsp;<span style="color: red">*</span></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.remoteCredentials }}
          </span>
        </td>
      </tr>

      <tr>
        <td align="left" valign="top" class="formCell" style="" id="isc_2OJ">
          <span id="isc_2OK" style="display: inline-block" class="formTitle" align="left"><label id="isc_2OM"
              for="isc_2OL">Local Filename</label>&nbsp;<span style="color: red">*</span></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.localFilename }}
          </span>
        </td>
        <td align="left" valign="top" class="formCell" style="" id="isc_2ON">
          <span id="isc_2OO" style="display: inline-block" class="formTitle" align="left"><label id="isc_2OQ"
              for="isc_2OP">Remote Filename</label>&nbsp;<span style="color: red">*</span></span><br />
          <span type="TEXT" name="credentials" id="isc_4GE" handlenativeevents="false" spellcheck="true"
            autocomplete="OFF" class="selectItemLiteText uc-field" style="width: 262px; height: 16px" tabindex="3325">
            {{ taskNode.localFilename }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts" setup>
import { TaskFtp } from "@/types/interfaces";
import { defineProps } from "vue";

defineProps({
  taskNode: {
    type: Object as () => TaskFtp,
    default: () => {
      return {} as TaskFtp;
    },
  },
});
</script>