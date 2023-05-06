<template>
  <div
    id="isc_M1"
    eventproxy="isc_OpswiseFormSectionLayout_6"
    class="normal"
    onscroll="return isc_OpswiseFormSectionLayout_6.$lh()"
  >
    <div id="isc_M2" eventproxy="isc_OpswiseFormSectionLayout_6">
      &nbsp;
      <div
        id="isc_M5"
        eventproxy="isc_Label_28"
        onscroll="return isc_Label_28.$lh()"
      >
        <div id="isc_M6" eventproxy="isc_Label_28" style="">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            width="645px"
            height="27px"
          >
            <tbody>
              <tr>
                <td
                  class="ucFormSectionLabelBold"
                  style="padding: 5px"
                  align="left"
                  valign="middle"
                >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        id="isc_M7"
        eventproxy="isc_OpswiseDynamicForm_6"
        class="normal"
        style=""
        onscroll="return isc_OpswiseDynamicForm_6.$lh()"
      >
        <div id="isc_M8" eventproxy="isc_OpswiseDynamicForm_6" style="">
          <form
            id="isc_M9"
            method="POST"
            action="#"
            enctype="application/x-www-form-urlencoded"
            onsubmit="return isc_OpswiseDynamicForm_6.$10d()"
            onreset="isc_OpswiseDynamicForm_6.resetValues(); return false;"
            style="margin-bottom: 0px"
            accept-charset="UTF-8"
          >
            <table
              role="presentation"
              id="isc_MA"
              cellspacing="0"
              cellpadding="3"
              border="0"
            >
              <colgroup>
                <col width="320" />
                <col width="321" />
              </colgroup>
              <tbody>
                <tr>
                  <td
                    style="
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
                    "
                    class=""
                  >
                    <div style="overflow: hidden; height: 0px"></div>
                  </td>
                  <td
                    style="
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
                    "
                    class=""
                  >
                    <div style="overflow: hidden; height: 0px"></div>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    id="isc_MB"
                  >
                    <span
                      id="isc_MC"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_ME" for="isc_MD">Name</label>&nbsp;<span
                        style="color: red"
                        >*</span
                      ></span
                    ><br /><span
                      type="TEXT"
                      name="name"
                      id="isc_MD"
                      handlenativeevents="false"
                      spellcheck="true"
                      oninput="isc_OpswiseTextItem_19._handleInput()"
                      onselect="if (window.isc_OpswiseTextItem_19 == null) return;isc_OpswiseTextItem_19.$1162()"
                      autocomplete="OFF"
                      class="textItemLite uc-field"
                      style="width: 292px; height: 16px"
                      tabindex="4477"
                    >
                      {{ taskNode.name }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    colspan="2"
                    id="isc_MF"
                  >
                    <span
                      id="isc_MG"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_MI" for="isc_MH">Description</label></span
                    ><br />
                    <span
                      type="TEXT"
                      name="description"
                      id="isc_MH"
                      handlenativeevents="false"
                      spellcheck="true"
                      oninput="isc_OpswiseTextItem_15._handleInput()"
                      onselect="if (window.isc_OpswiseTextItem_15 == null) return;isc_OpswiseTextItem_15.$1162()"
                      autocomplete="OFF"
                      class="textItemLite uc-field"
                      style="width: 613px; height: 16px"
                      tabindex="4605"
                    >
                      {{ taskNode.summary }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    colspan="2"
                    id="isc_MJ"
                  >
                    <span
                      id="isc_MK"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_ML"
                        >Member of Business Services</label
                      ></span
                    ><br />
                    <table
                      role="presentation"
                      id="isc_MN"
                      cellpadding="0"
                      cellspacing="0"
                      style="cursor: default; width: 635px"
                      class="selectItemLiteControl"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                          >
                            <div
                              id="isc_MM"
                              class="selectItemLiteText uc-field"
                              style="
                                width: 607px;
                                height: 16px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                line-height: 16px;
                              "
                              tabindex="4669"
                              role="presentation"
                            >
                              <span
                                style="padding-right: 9px"
                                v-for="(bs, index) in taskNode.opswiseGroups"
                                :key="index"
                              >
                                {{ bs }}
                              </span>
                            </div>
                          </td>
                          <td
                            id="isc_MO"
                            class="selectItemPickerIcon"
                            style="font-size: 22px"
                          >
                            <span
                              role="button"
                              id="isc_MP"
                              style="
                                margin-left: 0px;
                                display: block;
                                height: 22px;
                              "
                              tabindex="-1"
                              handlenativeevents="false"
                              ><span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 11px;
                                  height: 22px;
                                  vertical-align: middle;
                                  margin-top: 0px;
                                  margin-bottom: 0px;
                                  margin-left: 0px;
                                  display: block;
                                  cursor: pointer;
                                  -webkit-touch-callout: none;
                                "
                                id="isc_MQ"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 16px;
                                    height: 32px;
                                    background-position: 0px 12px;
                                    transform: scale(0.6875, 0.6875);
                                  "
                                  class="comboBoxItemPicker"
                                ></span></span
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    height="41"
                    id="isc_MR"
                  >
                    <span
                      id="isc_MS"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_MT">Resolve Name Immediately</label></span
                    ><br />
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      id="isc_MU"
                      style="
                        margin: 0px;
                        border: 0px;
                        padding: 0px;
                        background-image: none;
                        background-color: transparent;
                        -webkit-box-shadow: none;
                        box-shadow: none;
                        white-space: normal;
                      "
                      class="formCell"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                            valign="middle"
                          >
                            <div
                              id="isc_MV"
                              class="labelAnchor"
                              style="min-width: 194px; white-space: nowrap"
                              tabindex="4733"
                            >
                              <span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 24px;
                                  height: 24px;
                                  vertical-align: middle;
                                  margin-left: 4px;
                                  margin-right: 3px;
                                "
                                id="isc_MW"
                                eventpart="valueicon"
                              >
                                <span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 25px;
                                    height: 25px;
                                    transform: scale(0.96, 0.96);
                                  "
                                  :class="taskNode.resolveNameImmediately ? 'checkboxTrue': 'checkboxFalse'">
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    id="isc_MX"
                  >
                    <span
                      id="isc_MY"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_MZ">Time Zone Preference</label></span
                    ><br />
                    <table
                      role="presentation"
                      id="isc_N1"
                      cellpadding="0"
                      cellspacing="0"
                      style="cursor: default; width: 294px"
                      class="selectItemLiteControl"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                          >
                            <div
                              id="isc_N0"
                              class="selectItemLiteText uc-field"
                              style="
                                width: 266px;
                                height: 16px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                line-height: 16px;
                              "
                              tabindex="4797"
                              role="option"
                            >
                              {{ taskNode.timeZonePref }}
                            </div>
                          </td>
                          <td
                            id="isc_N2"
                            class="selectItemPickerIcon"
                            style="font-size: 22px"
                          >
                            <span
                              role="button"
                              id="isc_N3"
                              style="
                                margin-left: 0px;
                                display: block;
                                height: 22px;
                              "
                              tabindex="-1"
                              handlenativeevents="false"
                              ><span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 11px;
                                  height: 22px;
                                  vertical-align: middle;
                                  margin-top: 0px;
                                  margin-bottom: 0px;
                                  margin-left: 0px;
                                  display: block;
                                  cursor: pointer;
                                  -webkit-touch-callout: none;
                                "
                                id="isc_N4"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 16px;
                                    height: 32px;
                                    background-position: 0px 12px;
                                    transform: scale(0.6875, 0.6875);
                                  "
                                  class="comboBoxItemPicker"
                                ></span></span
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    height="41"
                    id="isc_N5"
                  >
                    <span
                      id="isc_N6"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_N7">Hold on Start</label></span
                    ><br />
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      id="isc_N8"
                      style="
                        margin: 0px;
                        border: 0px;
                        padding: 0px;
                        background-image: none;
                        background-color: transparent;
                        -webkit-box-shadow: none;
                        box-shadow: none;
                        white-space: normal;
                      "
                      class="formCell"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                            valign="middle"
                          >
                            <div
                              id="isc_N9"
                              class="labelAnchor"
                              style="min-width: 194px; white-space: nowrap"
                              tabindex="4861"
                            >
                              <span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 24px;
                                  height: 24px;
                                  vertical-align: middle;
                                  margin-left: 4px;
                                  margin-right: 3px;
                                "
                                id="isc_NA"
                                eventpart="valueicon"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 25px;
                                    height: 25px;
                                    transform: scale(0.96, 0.96);
                                  "
                                  :class="taskNode.startHeld ? 'checkboxTrue': 'checkboxFalse'">
                                </span
                              ></span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    id="isc_NB"
                  >
                    <span
                      id="isc_NC"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_ND"
                        >Virtual Resource Priority</label
                      ></span
                    ><br />
                    <table
                      role="presentation"
                      id="isc_NF"
                      cellpadding="0"
                      cellspacing="0"
                      style="cursor: default; width: 294px"
                      class="selectItemLiteControl"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                          >
                            <div
                              id="isc_NE"
                              class="selectItemLiteText"
                              style="
                                width: 266px;
                                height: 16px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                line-height: 16px;
                              "
                              tabindex="4989"
                              role="option"
                            >
                              {{ taskNode.resPriority }}
                            </div>
                          </td>
                          <td
                            id="isc_NG"
                            class="selectItemPickerIcon"
                            style="font-size: 22px"
                          >
                            <span
                              role="button"
                              id="isc_NH"
                              style="
                                margin-left: 0px;
                                display: block;
                                height: 22px;
                              "
                              tabindex="-1"
                              handlenativeevents="false"
                              ><span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 11px;
                                  height: 22px;
                                  vertical-align: middle;
                                  margin-top: 0px;
                                  margin-bottom: 0px;
                                  margin-left: 0px;
                                  display: block;
                                  cursor: pointer;
                                  -webkit-touch-callout: none;
                                "
                                id="isc_NI"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 16px;
                                    height: 32px;
                                    background-position: 0px 12px;
                                    transform: scale(0.6875, 0.6875);
                                  "
                                  class="comboBoxItemPicker"
                                ></span></span
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    height="41"
                    id="isc_NJ"
                  >
                    <span
                      id="isc_NK"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_NL"
                        >Hold Resources on Failure</label
                      ></span
                    ><br />
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      id="isc_NM"
                      style="
                        margin: 0px;
                        border: 0px;
                        padding: 0px;
                        background-image: none;
                        background-color: transparent;
                        -webkit-box-shadow: none;
                        box-shadow: none;
                        white-space: normal;
                      "
                      class="formCell"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                            valign="middle"
                          >
                            <div
                              id="isc_NN"
                              class="labelAnchor"
                              style="min-width: 194px; white-space: nowrap"
                              tabindex="5053"
                            >
                              <span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 24px;
                                  height: 24px;
                                  vertical-align: middle;
                                  margin-left: 4px;
                                  margin-right: 3px;
                                "
                                id="isc_NO"
                                eventpart="valueicon"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 25px;
                                    height: 25px;
                                    transform: scale(0.96, 0.96);
                                  "
                                  :class="taskNode.holdResources ? 'checkboxTrue': 'checkboxFalse'">
                                </span
                              ></span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    valign="top"
                    class="formCell"
                    style=""
                    height="41"
                    id="isc_NP"
                  >
                    <span
                      id="isc_NQ"
                      style="display: inline-block"
                      class="formTitle"
                      align="left"
                      ><label id="isc_NR"
                        >Mutually Exclusive With Self</label
                      ></span
                    ><br />
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      id="isc_NS"
                      style="
                        margin: 0px;
                        border: 0px;
                        padding: 0px;
                        background-image: none;
                        background-color: transparent;
                        -webkit-box-shadow: none;
                        box-shadow: none;
                        white-space: normal;
                      "
                      class="formCell"
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              margin: 0px;
                              border: 0px;
                              padding: 0px;
                              background-image: none;
                              background-color: transparent;
                              -webkit-box-shadow: none;
                              box-shadow: none;
                            "
                            valign="middle"
                          >
                            <div
                              id="isc_NT"
                              class="labelAnchor"
                              style="min-width: 194px; white-space: nowrap"
                              tabindex="5117"
                            >
                              <span
                                spriteviewport="true"
                                style="
                                  overflow: hidden;
                                  display: inline-block;
                                  width: 24px;
                                  height: 24px;
                                  vertical-align: middle;
                                  margin-left: 4px;
                                  margin-right: 3px;
                                "
                                id="isc_NU"
                                eventpart="valueicon"
                                ><span
                                  style="
                                    vertical-align: top;
                                    display: inline-block;
                                    transform-origin: left top;
                                    width: 25px;
                                    height: 25px;
                                    transform: scale(0.96, 0.96);
                                  "
                                  :class="taskNode.exclusiveWithSelf ? 'checkboxTrue': 'checkboxFalse'">
                                </span
                              ></span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TreeNode } from "@/types/interfaces";
import { defineComponent, onMounted, toRefs } from "vue";

export default defineComponent({
  props: {
    taskNode: {
      type: Object as () => TreeNode,
      default: () => {
        return {} as TreeNode;
      },
    },
  },
  setup(props) {
    
    onMounted(() => {
      console.log("generalComponent.onMounted: ", props.taskNode.name);
    })
    return {}
  },
}); </script>
