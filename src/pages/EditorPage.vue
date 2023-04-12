<template>
  <div class="geo-holder">
    <Geo />
  </div>
  <div class="tabs-holder">
    <Tabs>
      <Tab name="Region">
        <RegionLookup />
        <RegionEdit />
      </Tab>
      <Tab name="City"><CityEdit /></Tab>
      <Tab name="River"><RiverEdit /></Tab>
    </Tabs>
</div>
</template>

<script>

import Tab from '../components/Tab.vue'
import Tabs from '../components/Tabs.vue'
import Geo from '../components/Geo.vue'
import RegionLookup from '../components/RegionLookup.vue'
import RegionEdit from '../components/RegionEdit.vue'
import RiverEdit from '../components/RiverEdit.vue'
import CityEdit from '../components/CityEdit.vue'

export default {
  name: 'App',
  components: {
    Tab,
    Tabs,
    Geo,
    RegionLookup,
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

div.geo-holder {
  height: 100%;
  width: 66%;
  float: left;
}

div.tabs-holder {
  height: 100%;
  width: 33%;
  float: right;
}
</style>
