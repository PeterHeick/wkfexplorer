import { reactive } from "vue";

export const state = reactive({
  isConfigLoaded: false,
  isWkfLoaded: false,
  // isPlanLoaded: true,
  isPlanRead: true,           // 
  planUpdateInProgress: false,
  planDelete: false
})