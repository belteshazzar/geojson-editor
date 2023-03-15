<template>
  <Geo />
  <Tabs>
    <Tab name="Region"><RegionEdit /></Tab>
    <Tab name="City"><CityEdit /></Tab>
    <Tab name="River"><RiverEdit /></Tab>
  </Tabs>
</template>

<script>

import Tab from '../components/Tab.vue'
import Tabs from '../components/Tabs.vue'
import Geo from '../components/Geo.vue'
import RegionEdit from '../components/RegionEdit.vue'
import RiverEdit from '../components/RiverEdit.vue'
import CityEdit from '../components/CityEdit.vue'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    Geo,
    RegionEdit,
    RiverEdit,
    CityEdit
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
