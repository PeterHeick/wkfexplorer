// router.js eller router.ts

import { createRouter, createWebHistory } from 'vue-router'
import WorkflowComponent from '@/components/WorkflowComponent.vue'
import PlanComponent from '@/components/PlanComponent.vue'

const routes = [
  { path: '/', component: WorkflowComponent },
  { path: '/plan', component: PlanComponent },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
