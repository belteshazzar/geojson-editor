<template>
  <div class="sidebar">
    <div class="sidebar-padding">


    <div class="sidebar-third">
      <label for="name">Name: </label>
      <input type="text" id="name" name="name" v-model="name"/>
    </div>
    <div class="sidebar-third">
      <label for="known-as">Known As: </label>
      <input type="text" id="known-as" name="known-as" v-model="knownAs"/>
    </div>
    <div class="sidebar-third">
      <label for="part-of">Part Of: </label>
      <input type="text" id="part-of" name="part-of" v-model="partOf"/>
    </div>

    <div class="sidebar-third">
      <label for="prevYear">Previous Year: </label>
      <button id="prevYear" name="prevYear" @click="loadPrevious">{{ yearPrevious }}</button>
    </div>
    <div class="sidebar-third">
      <label for="year">Year: </label>
      <input type="text" id="year" name="year" v-model="year"/>
    </div>
    <div class="sidebar-third">
      <label for="nextYear">Next Year: </label>
      <button id="nextYear" name="nextYear" @click="loadNext">{{ yearNext }}</button>
    </div>

    <div class="sidebar-half">
      <label for="label-lat">Label Lat: </label>
      <input type="text" id="label-lat" name="label-lat" v-model="labelLat"/>
    </div>
    <div class="sidebar-half">
      <label for="label-lng">Label Lng: </label>
      <input type="text" id="label-lng" name="label-lng" v-model="labelLng"/>
    </div>

    <label for="source">Source: </label>
    <input type="text" id="source" name="source" v-model="source"/>

    <div class="sidebar-half">
      <label for="overlayUrl">Overlay: </label>
      <input type="text" id="overlayUrl" name="overlayUrl" v-model="overlayUrl"/>
    </div>
    <div class="sidebar-half">
      <button id="loadOverlay" name="loadOverlay" @click="loadOverlay">load overlay</button>
    </div>
    <div class="sidebar-half">
      <label for="overlayC1Lat">C1 Lat: </label>
      <input type="text" id="overlayC1Lat" name="overlayC1Lat" v-model="overlayC1Lat"/>
    </div>
    <div class="sidebar-half">
      <label for="overlayC1Lng">C1 Lng: </label>
      <input type="text" id="overlayC1Lng" name="overlayC1Lng" v-model="overlayC1Lng"/>
    </div>
    <div class="sidebar-half">
      <label for="overlayC2Lat">C2 Lat: </label>
      <input type="text" id="overlayC2Lat" name="overlayC2Lat" v-model="overlayC2Lat"/>
    </div>
    <div class="sidebar-half">
      <label for="overlayC2Lng">C2 Lng: </label>
      <input type="text" id="overlayC2Lng" name="overlayC2Lng" v-model="overlayC2Lng"/>
    </div>

    <div class="sidebar-full">
      <label for="note">Note: </label>
      <textarea id="note" name="note" rows="5" v-model="note"></textarea>
    </div>

    <div class="sidebar-full">
      <label for="geometry">Null: </label>
      <input type="checkbox" id="isNull" name="isNull" v-model="isNull" />
    </div>
    <div class="sidebar-full">
      <label for="geometry">Geometry: </label>
      <textarea id="geometry" name="geometry" :disabled="isNull" rows="5" v-model="geometry"></textarea>
    </div>


    <div class="sidebar-half">
      <button id="save" name="save" @click="save">save</button>
    </div>
    <div class="sidebar-half">
      <button id="reset" name="reset" @click="reset">clear selection</button>
    </div>

    <div style="height: 100px;"></div>

    <div class="sidebar-half">
      <button id="remove" name="remove" @click="remove">delete</button>
    </div>
  </div>
</div>
</template>

<script>

// import { store } from '../store'

export default {
  name: 'SideMenu',
  mounted() {
  },
  computed: {
    name: {
      get () {
        return this.$store.state.region.properties.name
      },
      set (value) {
        this.$store.commit('updateName', value)
      }
    },
    year: {
      get () {
        return this.$store.state.region.properties.year
      },
      set (value) {
        this.$store.commit('updateYear', Number.parseInt(value))
      }
    },
    yearNext: {
      get() {
        return this.$store.state.regionYearNext
      }
    },
    yearPrevious: {
      get() {
        return this.$store.state.regionYearPrevious
      }
    },
    knownAs: {
      get () {
        return this.$store.state.region.properties.known_as
      },
      set (value) {
        this.$store.commit('updateKnownAs', value)
      }
    },
    partOf: {
      get () {
        return this.$store.state.region.properties.part_of
      },
      set (value) {
        this.$store.commit('updatePartOf', value)
      }
    },
    source: {
      get () {
        return this.$store.state.region.properties.source
      },
      set (value) {
        this.$store.commit('updateSource', value)
      }
    },
    overlayUrl: {
      get () {
        return this.$store.state.region.properties.overlay.url
      },
      set (value) {
        this.$store.commit('updateOverlayUrl', value)
      }
    },
    overlayC1Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lat
      },
      set (value) {
        this.$store.commit('updateOverlayC1Lat', Number.parseFloat(value))
      }
    },
    overlayC1Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC1Lng', Number.parseFloat(value))
      }
    },
    overlayC2Lat: {
      get () {
        console.log(this.$store.state.region.properties)
        return this.$store.state.region.properties.overlay.c2.lat
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lat', Number.parseFloat(value))
      }
    },
    overlayC2Lng: {
      get () {
        console.log(this.$store.state.region.properties)
        return this.$store.state.region.properties.overlay.c2.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lng', Number.parseFloat(value))
      }
    },
    note: {
      get () {
        return this.$store.state.region.properties.note
      },
      set (value) {
        this.$store.commit('updateNote', value)
      }
    },
    labelLat: {
      get () {
        return this.$store.getters.region.properties.label.lat
      },
      set (value) {
        this.$store.commit('updateLabel', {lat:Number.parseFloat(value),lng:this.$store.region.properties.label.lng})
      }
    },
    labelLng: {
      get () {
        return this.$store.state.region.properties.label.lng
      },
      set (value) {
        this.$store.commit('updateLabel', {lat: this.$store.state.region.properties.label.lat, lng: Number.parseFloat(value)})
      }
    },
    isNull: {
      get () {
        return JSON.stringify(this.$store.state.region.geometry) == 'null'
      },
      set (value) {
        if (value) {
          this.$store.commit('updateGeometry', null)
        }
      }
    },
    geometry: {
      get () {
        return JSON.stringify(this.$store.state.region.geometry)
      },
      set (value) {
        this.$store.commit('updateGeometry', JSON.parse(value))
      }
    }
  },
  methods: {
    loadOverlay() {
      this.$store.dispatch('loadOverlay',this.overlayUrl)
    },
    save() {
      this.$store.dispatch('saveRegion')
    },
    reset() {
      this.$store.commit('resetRegion')
    },
    remove() {
      this.$store.dispatch('deleteRegion')
    },
    loadPrevious() {
      // this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
    },
    loadNext() {
      // this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
    }
  }
}

</script>

<style scoped>

/* ------------------ reset -------------- */

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

:root {
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  position: relative;
  font-family: system-ui, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  min-height: 100%;
}
body {
  position: relative;
  min-height: 100vh;
  font-size: 100%;
  line-height: 1.5;
}

input,
textarea,
button {
  font-size: inherit;
  font-family: inherit;
}

/* ------------------ /reset -------------- */

.sidebar {
  height: 100%;
  width: 100%;
}

.sidebar-padding {
  padding: 10px;
}

.sidebar-full {
  width: 100%;
  left: 0px;
}

.sidebar-half {
  width: 50%;
  float: left;
}

.sidebar-third {
  width: 33%;
  float: left;
}

.sidebar-qaurter {
  width: 25%;
  float: left;
}

.exists {
  border: 2px solid green;
}
.not-exists {
  border: 2px solid orange;
}

label {
  text-align: left;
}
input, label, textarea, button {
    display: block;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    /* font-size: large; */
}

input, textarea, button {
    width: calc(100% - 10px);
}

</style>
