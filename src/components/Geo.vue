<template>
  <div id="map" />
</template>

<script>
import { createMap,modifyRegionGeometry,modifyRegionLabel,modifyRegionOverlay } from './../controllers/leafletMap'

export default {
  name: 'LeafletMap',
  mounted () {
    createMap(this.$store)
  },
  computed: {
    name: {
      get () {
        return this.$store.state.region.properties.name
      }
    },
    labelLat: {
      get () {
        return this.$store.state.region.properties.label.lat
      }
    },
    labelLng: {
      get () {
        return this.$store.state.region.properties.label.lng
      }
    },
    overlayC1Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lat
      }
    },
    overlayC1Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lng
      }
    },
    overlayC2Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lat
      }
    },
    overlayC2Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lng
      }
    },
    geometry: {
      get () {
        return this.$store.state.region.geometry
      }
    }
  },
  watch: {
    name () {
      modifyRegionLabel()
    },
    labelLat () {
      modifyRegionLabel()
    },
    labelLng () {
      modifyRegionLabel()
    },
    overlayC1Lat () {
      modifyRegionOverlay()
    },
    overlayC1Lng () {
      modifyRegionOverlay()
    },
    overlayC2Lat () {
      modifyRegionOverlay()
    },
    overlayC2Lng () {
      modifyRegionOverlay()
    },
    geometry () {
      modifyRegionGeometry()
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
img.huechange2 { filter: hue-rotate(240deg); }

</style>
