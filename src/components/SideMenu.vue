<template>
  <div class="sidebar">
    <div class="sidebar-padding">

    <label for="region">Region: </label>
    <input type="search" class="not-exists" list="regionList" id="region" name="region" v-model="region" />
    <datalist id="regionList"></datalist>

    <label for="year">Year: </label>
    <input type="search" class="not-exists" list="yearList" id="year" name="year" v-model="year"/>
    <datalist id="yearList"></datalist>

    <label for="known-as">Known As: </label>
    <input type="text" id="known-as" name="known-as" v-model="knownAs"/>

    <label for="source">Source: </label>
    <input type="text" id="source" name="source" v-model="source"/>

    <label for="note">Note: </label>
    <textarea id="note" name="note" rows="10" v-model="note"></textarea>

    <label for="geojson">GeoJSON: </label>
    <textarea id="geojson" name="geojson" rows="10" disabled v-model="geojson"></textarea>

    <button id="submit" name="submit" @click="submit">submit</button>
    <button id="reset" name="reset" @click="reset">reset</button>
  </div>
</div>
</template>

<script>

import { store } from '../store'

export default {
  name: 'SideMenu',
  mounted() {
    fetch('http://localhost:3000/region')
      .then((response) => response.json())
      .then((data) => {
        const regionList = document.getElementById('regionList')
        data.regions.forEach(el => {
          const option = document.createElement("option");
          option.value = el
          regionList.appendChild(option);
        });
      });
  },
  data() {
    return {
      region: '',
      regionExists: false,
      year: '',
      yearExists: false,
      knownAs: '',
      source: '',
      note: '',
      geojson: '',
    }
  },
  watch: {
    action() {
      document.querySelector('#submit').textContent = this.action
    },
    region() {

      const regions = [...document.querySelectorAll('#regionList option')].map( option => option.value)

      this.year = ''
      this.yearExists = false
      const yearList = document.getElementById('yearList')
      yearList.replaceChildren()

      if (regions.includes(this.region)) {
        document.querySelector('#region').classList.remove('not-exists')
        document.querySelector('#region').classList.add('exists')

        fetch('http://localhost:3000/region/' + this.region)
          .then((response) => response.json())
          .then((data) => {
            data.years.forEach(el => {
              const option = document.createElement("option");
              option.value = el
              yearList.appendChild(option);
            });
            this.regionExists = true
          })
          .catch(() => {
            this.regionExists = false
          });

      } else {
        document.querySelector('#region').classList.remove('exists')
        document.querySelector('#region').classList.add('not-exists')
      }

    },
    year() {

      const years = [...document.querySelectorAll('#yearList option')].map( option => option.value)

      if (years.includes(this.year)) {
        document.querySelector('#year').classList.remove('not-exists')
        document.querySelector('#year').classList.add('exists')
        this.yearExists = true

        if (this.regionExists) {

          fetch('http://localhost:3000/region/' + this.region + '/' + this.year)
            .then((response) => response.json())
            .then((data) => {
              this.knownAs = data.properties.known_as
              this.source = data.properties.source
              this.note = data.properties.note
              this.geojson = JSON.stringify(data)

              store.commit('setGeoJSON', data)
            })
            .catch((reason) => {
              console.log(reason)
              this.regionExists = false
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
    submit() {
      console.log(this)
    },
    reset() {
      this.region = ''
      this.regionExists = false
      this.year = ''
      this.yearExists = false
      this.knownAs = ''
      this.source = ''
      this.note = ''
      this.geojson = ''
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
