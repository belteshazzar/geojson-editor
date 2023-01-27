<template>
  <div class="sidebar">
    <code-area />
    <!-- <bottom-menu /> -->
  </div>
</template>

<script>
import CodeArea from './CodeArea.vue'
// import BottomMenu from './BottomMenu.vue'

export default {
  name: 'SideMenu',
  components: {
    CodeArea,
    // BottomMenu,
  }
}
</script>

<style>
.sidebar {
  height: 100vh;
  width: 30%;
  float: right;
}
</style>
