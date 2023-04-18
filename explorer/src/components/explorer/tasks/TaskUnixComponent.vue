
<template>
  <table
    role="presentation"
    id="isc_X4"
    cellspacing="0"
    cellpadding="3"
    border="0"
  >
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
          Linux/Unix Details
        </td>
      </tr>
      <tr>
        <td align="left" valign="top">
          <span align="left"> <label> Command or Script </label>&nbsp; </span>
          <br />
          <span class="text">{{ taskNode.commandOrScript }}</span>
        </td>
      </tr>

      <tr>
        <td align="left" valign="top">
          <span align="left">
            <label>Command</label>
          </span>
          <br />
          <span id="td-command" class="text"></span>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" colspan="2">
          <span align="left">
            <label> Parameters</label>
          </span>
          <br />
          <span id="td-parameters" class="text"></span>
        </td>
      </tr>
      <tr>
        <td valign="top" colspan="2">
          <span align="left">
            <label> Runtime Directory </label>
          </span>
          <br />
          <span id="td-wd" class="text"></span>
        </td>
      </tr>

      <tr>
        <td valign="top" colspan="2">
          <span align="left">
            <label> Environment Variables </label>
          </span>
          <br />
          <!--
                  <div style="position:absolute;overflow:visible;z-index:1000;height:100%;width:601px">
                    <table id="isc_DS" role="presentation" border="0" margin="0" cellspacing="0" cellpadding="0"
                      style="position:absolute;height:100%;width:601px;">
                      <tbody id="td-envtable">
                        <tr>
                          <td align="CENTER" class="emptyMessage"
                            style="padding-left:0px;padding-right:0px;height:26px">
                            No items to show.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                -->
          <span id="td-env" class="text"></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
