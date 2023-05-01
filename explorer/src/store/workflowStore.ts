import { reactive, ref } from "vue";
import { TreeNode } from '../types/interfaces';
import { api } from "@/api/api";
import { config } from "./config";

/*
 Den her holder workflow og task data fra serveren.
 update henter og returnere workflow data.
 wkf skal sikkert ikke bruges.
*/
export const workflowStore = reactive({

  wkf: [] as TreeNode[],

  update() {
    return api.getAllWorkflows(config.uacenv.value)
      .then((data: TreeNode[]) => {
        this.wkf = data;
        console.log('workflowStore.wkf.length ', this.wkf.length);
        console.log('workflowStore.update: api.getAllTasks ', data.length);
        return data;
      })
  }
})
