<template>
  <div class="sidebar">
    <div class="sidebar-padding">

    <div class="sidebar-half">
      <label for="name">Name: </label>
      <input type="search" class="not-exists" list="nameList" id="name" name="name" v-model="name" />
      <datalist id="nameList"></datalist>
    </div>

    <div class="sidebar-half">
      <label for="year">Year: </label>
      <input type="search" class="not-exists" list="yearList" id="year" name="year" v-model="year"/>
      <datalist id="yearList"></datalist>
    </div>

    <label for="known-as">Known As: </label>
    <input type="text" id="known-as" name="known-as" v-model="knownAs"/>

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
      <button id="submit" name="submit" @click="submit">submit</button>
    </div>
    <div class="sidebar-half">
      <button id="reset" name="reset" @click="reset">reset</button>
    </div>
  </div>
</div>
</template>

<script>

// import { store } from '../store'

export default {
  name: 'SideMenu',
  mounted() {
    fetch('http://localhost:3000/region')
      .then((response) => response.json())
      .then((data) => {
        const nameList = document.getElementById('nameList')
        data.regions.forEach(el => {
          const option = document.createElement("option");
          option.value = el
          nameList.appendChild(option);
        });
      });
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
    year: {
      get () {
        return this.$store.state.geojson.properties.year
      },
      set (value) {
        this.$store.commit('updateYear', value)
      }
    },
    knownAs: {
      get () {
        return this.$store.state.geojson.properties.known_as
      },
      set (value) {
        this.$store.commit('updateKnownAs', value)
      }
    },
    source: {
      get () {
        return this.$store.state.geojson.properties.source
      },
      set (value) {
        this.$store.commit('updateSource', value)
      }
    },
    overlayUrl: {
      get () {
        return this.$store.state.geojson.properties.overlay.url
      },
      set (value) {
        this.$store.commit('updateOverlayUrl', value)
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
    note: {
      get () {
        return this.$store.state.geojson.properties.note
      },
      set (value) {
        this.$store.commit('updateNote', value)
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
    geometry: {
      get () {
        return JSON.stringify(this.$store.state.geojson.geometry)
      },
      set (value) {
        this.$store.commit('updateGeometry', JSON.parse(value))
      }
    }
  },
  data() {
    return {
      nameExists: false,
      yearExists: false,
    }
  },
  watch: {
    name(newName,oldName) {

      if (newName.toLowerCase() == oldName.toLowerCase()) {
        return
      }
      const names = [...document.querySelectorAll('#nameList option')].map( option => option.value)

      this.yearExists = false
      const yearList = document.getElementById('yearList')
      yearList.replaceChildren()

      if (names.includes(this.name)) {
        document.querySelector('#name').classList.remove('not-exists')
        document.querySelector('#name').classList.add('exists')

        fetch('http://localhost:3000/region/' + this.name)
          .then((response) => response.json())
          .then((data) => {
            data.years.forEach(el => {
              const option = document.createElement("option");
              option.value = el
              yearList.appendChild(option);
            });
            this.nameExists = true
          })
          .catch(() => {
            this.nameExists = false
          });

      } else {
        document.querySelector('#name').classList.remove('exists')
        document.querySelector('#name').classList.add('not-exists')
      }
    },
    year() {

      const years = [...document.querySelectorAll('#yearList option')].map( option => option.value)

      if (years.includes(`${this.year}`)) {
        document.querySelector('#year').classList.remove('not-exists')
        document.querySelector('#year').classList.add('exists')
        this.yearExists = true

        if (this.nameExists) {

          fetch('http://localhost:3000/region/' + this.name + '/' + this.year)
            .then((response) => response.json())
            .then((data) => {
              // this.knownAs = data.properties.known_as
              // this.source = data.properties.source
              // this.note = data.properties.note
              // this.geometry = JSON.stringify(data.geometry)
              this.$store.commit('updateKnownAs',data.properties.known_as)
              this.$store.commit('updateSource',data.properties.source)
              this.$store.commit('updateOverlayUrl',data.properties.overlay.url)
              this.$store.commit('updateOverlayC1Lat',data.properties.overlay.c1.lat)
              this.$store.commit('updateOverlayC1Lng',data.properties.overlay.c1.lng)
              this.$store.commit('updateOverlayC2Lat',data.properties.overlay.c2.lat)
              this.$store.commit('updateOverlayC2Lng',data.properties.overlay.c2.lng)
              this.$store.commit('updateNote',data.properties.note)
              this.$store.commit('updateLabelLat',data.properties.label.lat)
              this.$store.commit('updateLabelLng',data.properties.label.lng)
              this.$store.commit('updateGeometry',data.geometry)

              // store.commit('setGeoJSON', data)
            })
            .catch((reason) => {
              console.log(reason)
              this.nameExists = false
            });

        }

      } else {
        document.querySelector('#year').classList.remove('exists')
        document.querySelector('#year').classList.add('not-exists')
        this.yearExists = false
      }

    }
  },
  methods: {
    loadOverlay() {
      this.$store.dispatch('loadOverlay',this.source)
    },
    async submit() {

      const geojson = this.$store.getters.geojson

      await fetch(`http://localhost:3000/region/${geojson.properties.name}/${geojson.properties.year}`,{
        method: 'PUT',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'error',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(geojson) 
      })

      .then((data) => {
        alert('Success:', data);
      })
      .catch((error) => {
        alert('Error:', error);
      });
    },
    reset() {
      this.$store.commit('updateName','')
      this.$store.commit('updateYear','')
      this.$store.commit('updateKnownAs','')
      this.$store.commit('updateSource','')
      this.$store.commit('updateOverlayUrl','')
      this.$store.commit('updateOverlayC1Lat',0.0)
      this.$store.commit('updateOverlayC1Lng',0.0)
      this.$store.commit('updateOverlayC2Lat',0.0)
      this.$store.commit('updateOverlayC2Lng',0.0)
      this.$store.commit('updateNote','')
      this.$store.commit('updateLabelLat',0.0)
      this.$store.commit('updateLabelLng',0.0)
      this.$store.commit('updateGeometry',null)
    }
  }
}

</script>

<style>
.sidebar {
  height: 100vh;
  width: 30%;
  float: right;
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
    font-size: large;
}

input, textarea, button {
    width: calc(100% - 10px);
}

</style>
