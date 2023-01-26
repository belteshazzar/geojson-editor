<template>
  <Geo />
  <SideMenu />
</template>

<script>
import Geo from './components/Geo.vue'
import SideMenu from './components/SideMenu.vue'

export default {
  name: 'App',
  components: {
    Geo,
    SideMenu
  }
}
</script>

<style>
/*
https://www.w3schools.com/css/css_grid_item.asp
*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
}
</style>
