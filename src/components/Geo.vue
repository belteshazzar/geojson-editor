<template>
  <div id="map" />
</template>

<script>
import { createMap,modifyGeoJSON,modifyLabel,modifyOverlay } from './../controllers/leafletMap'

export default {
  name: 'LeafletMap',
  mounted () {
    createMap(this.$store)
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
    labelLat: {
      get () {
        return this.$store.state.geojson.properties.label.lat
      },
      set (value) {
        this.$store.commit('updateLabelLat', value)
      }
    },
    labelLng: {
      get () {
        return this.$store.state.geojson.properties.label.lng
      },
      set (value) {
        this.$store.commit('updateLabelLng', value)
      }
    },
    overlayC1Lat: {
      get () {
        return this.$store.state.geojson.properties.overlay.c1.lat
      },
      set (value) {
        this.$store.commit('updateOverlayC1Lat', value)
      }
    },
    overlayC1Lng: {
      get () {
        return this.$store.state.geojson.properties.overlay.c1.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC1Lng', value)
      }
    },
    overlayC2Lat: {
      get () {
        return this.$store.state.geojson.properties.overlay.c2.lat
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lat', value)
      }
    },
    overlayC2Lng: {
      get () {
        return this.$store.state.geojson.properties.overlay.c2.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lng', value)
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
      modifyLabel()
    },
    labelLat () {
      modifyLabel()
    },
    labelLng () {
      modifyLabel()
    },
    overlayC1Lat () {
      modifyOverlay()
    },
    overlayC1Lng () {
      modifyOverlay()
    },
    overlayC2Lat () {
      modifyOverlay()
    },
    overlayC2Lng () {
      modifyOverlay()
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

img.huechange { filter: hue-rotate(120deg); }

</style>
