import { createWebHistory, createRouter } from "vue-router";

import EditorPage from "./pages/EditorPage.vue";
// import PreviewPage from "./pages/PreviewPage.vue"

const routes = [
  {
    path: "/",
   component: EditorPage,
  // },
  // {
  //   path: "/preview",
  //   component: PreviewPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;