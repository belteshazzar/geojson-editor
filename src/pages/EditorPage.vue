<template>
  <Geo />
  <Tabs>
    <Tab name="Region"><SideMenu /></Tab>
    <Tab name="City">Tab 2</Tab>
    <Tab name="River">Tab 3</Tab>
  </Tabs>
</template>

<script>

import Tab from '../components/Tab.vue'
import Tabs from '../components/Tabs.vue'
import Geo from '../components/Geo.vue'
import SideMenu from '../components/SideMenu.vue'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    Geo,
    SideMenu
  },
}
</script>

<style>
/*
https://www.w3schools.com/css/css_grid_item.asp
*/

html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
}
</style>
