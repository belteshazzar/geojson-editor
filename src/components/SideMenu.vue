<template>
  <top-menu :loading-github-user="loadingGithubUser" />
  <code-area />
  <bottom-menu />
</template>

<script>
import CodeArea from './Code.vue'
import TopMenu from './TopMenu.vue'
import BottomMenu from './BottomMenu.vue'

export default {
  name: 'SideMenu',
  components: {
    CodeArea,
    BottomMenu,
    TopMenu
  },
  props: {
    loadingGithubUser: Boolean
  }
}
</script>

<style>
.sidebar {
  height: 100%;
}
</style>
