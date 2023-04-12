<template>
  <div class="sidebar">
    <div class="sidebar-padding">


    <div class="sidebar-half">
      <label for="known-as">Known As: </label>
      <input type="text" id="known-as" name="known-as" v-model="knownAs"/>
    </div>
    <div class="sidebar-half">
      <label for="yearTo">Year To: </label>
      <input type="text" id="yearTo" name="yearTo" v-model="yearTo"/>
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

    <label for="geometry">Geometry: </label>
    <textarea id="geometry" name="geometry" rows="5" v-model="geometry"></textarea>


    <div class="sidebar-half">
      <button id="save" name="save" @click="save">save</button>
    </div>
    <div class="sidebar-half">
      <button id="reset" name="reset" @click="reset">clear selection</button>
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
    yearFrom: {
      get () {
        return this.$store.state.region.properties.year.from
      },
      set (value) {
        this.$store.commit('updateYearFrom', value)
      }
    },
    yearTo: {
      get () {
        return this.$store.state.region.properties.year.to
      },
      set (value) {
        this.$store.commit('updateYearTo', value)
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
        this.$store.commit('updateOverlayC1Lat', value)
      }
    },
    overlayC1Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC1Lng', value)
      }
    },
    overlayC2Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lat
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lat', value)
      }
    },
    overlayC2Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lng
      },
      set (value) {
        this.$store.commit('updateOverlayC2Lng', value)
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
        this.$store.commit('updateLabel', {lat:value,lng:this.$store.region.properties.label.lng})
      }
    },
    labelLng: {
      get () {
        return this.$store.state.region.properties.label.lng
      },
      set (value) {
        this.$store.commit('updateLabel', {lat: this.$store.state.region.properties.label.lat, lng: value})
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
    async remove() {

      const that = this;
      const region = this.$store.getters.region

      await fetch(`http://localhost:3000/regions/${region.properties.name}/${region.properties.year.from}`,{
        method: 'DELETE',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        redirect: 'error',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        alert('Success:', response);
        that.reset()
      })
      .catch((error) => {
        alert(error.message);
      });

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
