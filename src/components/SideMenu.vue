<template>
  <code-area />
  <bottom-menu />
</template>

<script>
import CodeArea from './CodeArea.vue'
import BottomMenu from './BottomMenu.vue'

export default {
  name: 'SideMenu',
  components: {
    CodeArea,
    BottomMenu,
  }
}
</script>

<style>
.sidebar {
  height: 100%;
}
</style>
