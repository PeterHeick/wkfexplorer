import { reactive, ref } from "vue";
import { TreeNode } from '../types/interfaces';
import { api } from "@/api/api";
import config from "./config";

/*
 Den her holder workflow og task data fra serveren.
 update henter og returnere workflow data.
 wkf skal sikkert ikke bruges.
*/
export const workflowStore = reactive({

  wkf: [] as TreeNode[],
  isLoading: false,

  // Kaldes fra ToolbarComponent
  update() {
    this.isLoading = true;
    return api.getAllWorkflows(config.uacenv.value)
      .then((data: TreeNode[]) => {
        this.wkf = data;
        console.log("workflowStore.update()");
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.wkf = [];
      });
  }
})
