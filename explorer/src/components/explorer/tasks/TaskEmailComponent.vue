<template>
  <table
    role="presentation"
    id="isc_8BF"
    cellspacing="0"
    cellpadding="3"
    border="0"
  >
    <colgroup>
      <col width="225" />
      <col width="226" />
    </colgroup>
    <tbody>
      <tr>
        <td
          class="ucFormSectionLabelBold"
          style="padding: 5px"
          align="left"
          valign="middle"
        >
          Email Details
        </td>
      </tr>
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
          colspan="2"
          id="isc_8CA"
        >
          <span
            id="isc_8CB"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8CD" for="isc_8CC">Reply-To</label></span
          ><br />
          <span
            type="TEXT"
            name="credentials"
            id="isc_4GE"
            handlenativeevents="false"
            spellcheck="true"
            autocomplete="OFF"
            class="selectItemLiteText uc-field"
            style="width: 262px; height: 16px; width: 423px; height: 20px"
            tabindex="3325"
          >
            {{ taskNode.replyTo }}
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
          id="isc_8CE"
        >
          <div>
            <span
              id="isc_8CF"
              style="display: inline-block"
              class="formTitle"
              align="left"
              ><label id="isc_8CH" for="isc_8CG">To</label></span
            ><br />
            <span
              type="TEXT"
              name="credentials"
              id="isc_4GE"
              handlenativeevents="false"
              spellcheck="true"
              autocomplete="OFF"
              class="selectItemLiteText uc-field"
              style="width: 423px; height: 40px"
              tabindex="3325"
            >
              {{ taskNode.toRecipients }}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td
          align="left"
          valign="top"
          class="formCell"
          style=""
          colspan="2"
          id="isc_8CI"
        >
          <div>
            <span
              id="isc_8CJ"
              style="display: inline-block"
              class="formTitle"
              align="left"
              ><label id="isc_8CL" for="isc_8CK">Cc</label></span
            ><br />
            <span
              type="TEXT"
              name="credentials"
              id="isc_4GE"
              handlenativeevents="false"
              spellcheck="true"
              autocomplete="OFF"
              class="selectItemLiteText uc-field"
              style="width: 423px; height: 40px"
              tabindex="3325"
            >
              {{ taskNode.ccRecipients }}
            </span>

          </div>
        </td>
      </tr>
      <tr>
        <td
          align="left"
          valign="top"
          class="formCell"
          style=""
          colspan="2"
          id="isc_8CM"
        >
          <div>
            <span
              id="isc_8CN"
              style="display: inline-block"
              class="formTitle"
              align="left"
              ><label id="isc_8CP" for="isc_8CO">Bcc</label></span
            ><br />
            
            <span
              type="TEXT"
              name="credentials"
              id="isc_4GE"
              handlenativeevents="false"
              spellcheck="true"
              autocomplete="OFF"
              class="selectItemLiteText uc-field"
              style="width: 423px; height: 40px"
              tabindex="3325"
            >
              {{ taskNode.bccRecipients }}
            </span>

          </div>
        </td>
      </tr>
      <tr>
        <td
          align="left"
          valign="top"
          class="formCell"
          style=""
          colspan="2"
          id="isc_8CQ"
        >
          <span
            id="isc_8CR"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8CT" for="isc_8CS">Subject</label></span
          ><br />
          <span
              type="TEXT"
              name="credentials"
              id="isc_4GE"
              handlenativeevents="false"
              spellcheck="true"
              autocomplete="OFF"
              class="selectItemLiteText uc-field"
              style="width: 423px; height: 20px"
              tabindex="3325"
            >
              {{ taskNode.subject }}
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
          id="isc_8CU"
        >
          <div>
            <span
              id="isc_8CV"
              style="display: inline-block"
              class="formTitle"
              align="left"
              ><label id="isc_8CX" for="isc_8CW">Body</label></span
            ><br />
            <span
              type="TEXT"
              name="credentials"
              id="isc_4GE"
              handlenativeevents="false"
              spellcheck="true"
              autocomplete="OFF"
              class="selectItemLiteText uc-field"
              style="width: 423px; height: 200px"
              tabindex="3325"
            >
              {{ taskNode.subject }}
            </span>      

          </div>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" id="isc_8CY">
          <span
            id="isc_8CZ"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8D1" for="isc_8D0">Report</label></span
          ><br />
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            id="isc_8D2"
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
                  <table
                    role="presentation"
                    id="isc_8D3"
                    cellpadding="0"
                    cellspacing="0"
                    style="cursor: default; width: 195px"
                    class="selectItemLiteControl"
                  >
                    <tbody>
                      <tr>
                        <td style="white-space: nowrap">
                          <input
                            type="TEXT"
                            name="reportId"
                            id="isc_8D0"
                            handlenativeevents="false"
                            spellcheck="true"
                            oninput="isc_OpswiseReferenceItem_105._handleInput()"
                            autocomplete="OFF"
                            class="selectItemLiteText"
                            style="width: 167px; height: 16px"
                            tabindex="3187"
                          />
                        </td>
                        <td
                          id="isc_8D5"
                          class="selectItemPickerIcon"
                          style="font-size: 22px"
                        >
                          <span
                            role="button"
                            id="isc_8D6"
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
                              id="isc_8D7"
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
                  valign="middle"
                  style="
                    margin: 0px;
                    border: 0px;
                    padding: 0px;
                    background-image: none;
                    background-color: transparent;
                    -webkit-box-shadow: none;
                    box-shadow: none;
                    line-height: 18px;
                  "
                  class="formCell"
                  id="isc_8D8"
                >
                  <table
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    margin="0"
                    style=""
                  >
                    <tbody>
                      <tr>
                        <td>
                          <span
                            role="button"
                            id="isc_8B9"
                            style="
                              margin-left: 0px;
                              display: block;
                              height: 22px;
                            "
                            tabindex="3188"
                            handlenativeevents="false"
                            ><img
                              src="https://s0299035.su.dk:8443/uc/skins/Light/images/uc/listIcon.png"
                              width="21"
                              height="22"
                              align="absmiddle"
                              style="
                                vertical-align: middle;
                                margin-top: 0px;
                                margin-bottom: 0px;
                                margin-left: 3px;
                                display: block;
                                cursor: pointer;
                                -webkit-touch-callout: none;
                              "
                              id="isc_8D9"
                              border="0"
                              suppress="TRUE"
                              draggable="true"
                          /></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
          id="isc_8DA"
        >
          <span
            id="isc_8DB"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8DC">Report Variable</label></span
          ><br />
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            id="isc_8DD"
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
                    id="isc_8DE"
                    class="labelAnchor"
                    style="min-width: 194px; white-space: nowrap"
                    tabindex="3190"
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
                      id="isc_8DF"
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
                        class="checkboxFalse"
                      ></span
                    ></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td align="left" valign="top" class="formCell" style="" id="isc_8DG">
          <span
            id="isc_8DH"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8DI">List Report Format</label></span
          ><br />
          <table
            role="presentation"
            id="isc_8DK"
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
                    id="isc_8DJ"
                    class="selectItemLiteText"
                    style="
                      width: 266px;
                      height: 16px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      line-height: 16px;
                    "
                    tabindex="3191"
                    role="option"
                  >
                    PDF
                  </div>
                </td>
                <td
                  id="isc_8DL"
                  class="selectItemPickerIcon"
                  style="font-size: 22px"
                >
                  <span
                    role="button"
                    id="isc_8DM"
                    style="margin-left: 0px; display: block; height: 22px"
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
                      id="isc_8DN"
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
          id="isc_8DO"
        >
          <span
            id="isc_8DP"
            style="display: inline-block"
            class="formTitle"
            align="left"
            ><label id="isc_8DQ">Attach Local File</label></span
          ><br />
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            id="isc_8DR"
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
                    id="isc_8DS"
                    class="labelAnchor"
                    style="min-width: 194px; white-space: nowrap"
                    tabindex="3192"
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
                      id="isc_8DT"
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
                        class="checkboxFalse"
                      ></span
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
</template>

<script lang="ts">
import { TaskEmail } from "@/types/interfaces";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    taskNode: {
      type: Object as () => TaskEmail,
      default: () => {
        return {} as TaskEmail;
      },
    },
  },
  setup(props) {
    onMounted(() => {
      console.log("TaskEmailComponent.onMounted: ", props.taskNode.name);
    });
    return {};
  },
});
</script>
