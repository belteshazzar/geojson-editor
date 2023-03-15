<template>
  <div class="sidebar">
    <div class="sidebar-padding">

    <label for="cityName">Name: </label>
    <input type="search" class="not-exists" list="cityList" id="cityName" name="cityName" v-model="cityName" />
    <datalist id="cityList"></datalist>

    <label for="cityLat">Latitude: </label>
    <input type="text" id="cityLat" name="cityLat" v-model="cityLat"/>

    <label for="cityLng">Longitude: </label>
    <input type="text" id="cityLng" name="cityLng" v-model="cityLng"/>

    <label for="cityFounded">Founded: </label>
    <input type="text" id="cityFounded" name="cityFounded" v-model="cityFounded"/>

    <label for="cityAbandoned">Abandoned: </label>
    <input type="text" id="cityAbandoned" name="cityAbandoned" v-model="cityAbandoned"/>

    <label for="citySource">Source: </label>
    <input type="text" id="citySource" name="citySource" v-model="citySource"/>

    <label for="cityNote">Note: </label>
    <textarea id="cityNote" name="cityNote" rows="5" v-model="cityNote"></textarea>

    <div class="sidebar-half">
      <button id="citySubmit" name="citySubmit" @click="submit">submit</button>
    </div>
    <div class="sidebar-half">
      <button id="cityReset" name="cityReset" @click="reset">reset</button>
    </div>
  </div>
  </div>
</template>

<script>

// import { store } from '../store'

export default {
  name: 'SideMenu',
  mounted() {
    fetch('http://localhost:3000/city')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const cityList = document.getElementById('cityList')
        data.cities.forEach(el => {
          const option = document.createElement("option");
          option.value = el
          cityList.appendChild(option);
        });
      });
  },
  data() {
    return {
      cityExists: false,
      cityName: '',
      cityLat: '',
      cityLng: '',
      cityFounded: '',
      cityAbandoned: '',
      citySource: '',
      cityNote: ''
    }
  },
  watch: {
    cityName(newName,oldName) {

      if (newName.toLowerCase() == oldName.toLowerCase()) {
        return
      }

      const names = [...document.querySelectorAll('#cityList option')].map( option => option.value)
      this.cityExists = names.includes(newName)

      if (this.cityExists) {
        document.querySelector('#cityName').classList.remove('not-exists')
        document.querySelector('#cityName').classList.add('exists')

        fetch('http://localhost:3000/city/' + newName)
            .then((response) => response.json())
            .then((data) => {
              this.cityName = data.properties.name
              this.cityLat = data.geometry.coordinates[0]
              this.cityLng = data.geometry.coordinates[1]
              this.cityFounded = data.properties.founded
              this.cityAbandoned = data.properties.abandoned
              this.citySource = data.properties.source
              this.cityNote = data.properties.note
            })
            .catch((reason) => {
              console.log(reason)
              this.nameExists = false
            });

      } else {
        document.querySelector('#cityName').classList.remove('exists')
        document.querySelector('#cityName').classList.add('not-exists')
      }
    }
  },
  methods: {
    async submit() {

      const geojson = {
        "type": "Feature",
        "properties": {
          "name": this.cityName,
          "founded": this.cityFounded,
          "abandoned": this.cityAbandoned,
          "source": this.citySource,
          "note": this.cityNote
        },
        "geometry": {
          "coordinates": [
            this.cityLat, this.cityLng
          ],
          "type": "Point"
        }
      }

      await fetch(`http://localhost:3000/city/${this.cityName.toLowerCase()}`,{
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
