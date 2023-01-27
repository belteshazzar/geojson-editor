<template>
  <div id="map" />
</template>

<script>
import { createMap,modifyGeoJSON } from './../controllers/leafletMap'

export default {
  name: 'LeafletMap',
  mounted () {
    createMap()
  },
  computed: {
    name: {
      get () {
        return this.$store.state.geojson.properties.name
      },
      set (value) {
        this.$store.commit('updateName', value)
      }
    },
    labelX: {
      get () {
        return this.$store.state.geojson.properties.label_x
      },
      set (value) {
        this.$store.commit('updateLabelX', value)
      }
    },
    labelY: {
      get () {
        return this.$store.state.geojson.properties.label_y
      },
      set (value) {
        this.$store.commit('updateLabelY', value)
      }
    },
    geometry: {
      get () {
        return this.$store.state.geojson.geometry
      },
      set (value) {
        this.$store.commit('updateGeometry', value)
      }
    }
  },
  watch: {
    name () {
      modifyGeoJSON()
    },
    labelX () {
      modifyGeoJSON()
    },
    labelY () {
      modifyGeoJSON()
    },
    geometry () {
      modifyGeoJSON()
    }
  }
}
</script>

<style>
#map {
  height: 100%;
  width: 70%;
  float: left;
}

</style>
