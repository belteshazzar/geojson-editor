<template>
  <div class="sidebar">
    <div class="sidebar-padding">

    <label for="name">Name: </label>
    <input type="search" class="not-exists" list="nameList" id="name" name="name" v-model="name" />
    <datalist id="nameList"></datalist>

    <label for="year">Year: </label>
    <input type="search" class="not-exists" list="yearList" id="year" name="year" v-model="year"/>
    <datalist id="yearList"></datalist>

    <label for="known-as">Known As: </label>
    <input type="text" id="known-as" name="known-as" v-model="knownAs"/>

    <label for="label-x">Label Lng: </label>
    <input type="text" id="label-x" name="label-x" v-model="labelX"/>

    <label for="label-y">Label Lat: </label>
    <input type="text" id="label-y" name="label-y" v-model="labelY"/>

    <label for="source">Source: </label>
    <input type="text" id="source" name="source" v-model="source"/>

    <label for="note">Note: </label>
    <textarea id="note" name="note" rows="5" v-model="note"></textarea>

    <label for="geometry">Geometry: </label>
    <textarea id="geometry" name="geometry" rows="10" v-model="geometry"></textarea>

    <button id="submit" name="submit" @click="submit">submit</button>
    <button id="reset" name="reset" @click="reset">reset</button>
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
    note: {
      get () {
        return this.$store.state.geojson.properties.note
      },
      set (value) {
        this.$store.commit('updateNote', value)
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
              this.$store.commit('updateNote',data.properties.note)
              this.$store.commit('updateLabelX',data.properties.label_x)
              this.$store.commit('updateLabelY',data.properties.label_y)
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
      this.$store.commit('updateNote','')
      this.$store.commit('updateLabelX',0.0)
      this.$store.commit('updateLabelY',0.0)
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
