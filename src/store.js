
import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      loading: true,
      display: {
        cities: true,
        rivers: true,
      },
      region: {
        type: 'Feature',
        properties: {
          name: '',
          year: { from : '', to: '' },
          known_as: '',
          source: '',
          overlay: { url: '', c1: { lat: 0.0, lng: 0.0 }, c2: { lat: 0.0, lng: 0.0 }},
          note: '',
          label: { lat: 0.0, lng: 0.0 },
        },
        geometry: null
      },
      regionEdited: false,
      regions: {},
      regionsSize: 0,
      city: {},
      cities: {},
      rivers: {}
    }
  },
  mutations: {
    addRegion(state,{name,year,geojson}) {
      if (!state.regions[name]) state.regions[name] = {}
      state.regions[name][year] = geojson
      state.regionsSize++
    },
    setRegion(state,{name,year}) {
      if (state.regionEdited) return
      console.log('set region')
      state.region = state.regions[name][year]
    },
    resetRegion: function(state) {
      console.log('reset')
      state.region = {
        type: 'Feature',
        properties: {
          name: '',
          year: { from : '', to: '' },
          known_as: '',
          source: '',
          overlay: { url: '', c1: { lat: 0.0, lng: 0.0 }, c2: { lat: 0.0, lng: 0.0 }},
          note: '',
          label: { lat: 0.0, lng: 0.0 },
        },
        geometry: null
      }
      state.regionEdited = false
    },
    addCity(state,city) {
      state.cities[city.name] = city
    },
    addRiver(state,river) {
      state.rivers[river.name] = river
    },
    //////////////////////
    updateName(state,_name) {
      state.region.properties.name = _name
      state.regionEdited = true
    },
    updateYearFrom(state,_year) {
      state.region.properties.year.from = _year
      state.regionEdited = true
    },
    updateYearTo(state,_year) {
      state.region.properties.year.to = _year
      state.regionEdited = true
    },
    updateKnownAs(state,_known_as) {
      state.region.properties.known_as = _known_as
      state.regionEdited = true
    },
    updateSource(state,_source) {
      state.region.properties.source = _source
      state.regionEdited = true
    },
    updateOverlayUrl(state,_url) {
      state.region.properties.overlay.url = _url
      state.regionEdited = true
    },
    updateOverlayC1(state,{lat,lng}) {
      state.region.properties.overlay.c1.lat = lat
      state.region.properties.overlay.c1.lng = lng
      state.regionEdited = true
    },
    updateOverlayC2(state,{lat,lng}) {
      state.region.properties.overlay.c2.lat = lat
      state.region.properties.overlay.c2.lng = lng
      state.regionEdited = true
    },
    updateNote(state,_note) {
      state.region.properties.note = _note
      state.regionEdited = true
    },
    updateLabel(state,{lat,lng}) {
      // console.log(lat,lng)
      state.region.properties.label.lat = lat
      state.region.properties.label.lng = lng
      state.regionEdited = true
    },
    updateGeometry(state,_geometry) {
      state.region.geometry = _geometry
      state.regionEdited = true
    },
  },
  actions: {
    saveRegion: async function(store) {

      const region = store.state.region

      await fetch(`http://localhost:3000/regions/${region.properties.name}/${region.properties.year.from}`,{
        method: 'PUT',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'error',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(region) 
      })

      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        alert('Success:', response);
        store.state.regionEdited = false
      })
      .catch((error) => {
        alert('Error:', error);
      });


    },
    loadOverlay: function() {
    },
    removeOverlay: function() {
    }
  },
  getters: {
    region: function (state) {
      return state.region;
    }
  }
})

function fetchRegions() {
  fetch('http://localhost:3000/regions')
    .then((response) => response.json())
    .then((data) => {
        for (const name of Object.keys(data)) {
          const region = data[name]
          for (const year of Object.keys(region.years)) {
            const geojson = region.years[year]
            store.commit('addRegion',{name,year,geojson})
          }
        }
      });
}

function fetchRivers() {
  fetch('http://localhost:3000/rivers')
  .then((response) => response.json())
  .then((data) => {
    for (var r in data) {
      store.commit('addRiver',{ name: r, geojson: data[r] })
    }
  })
}

function fetchCities() {
  fetch('http://localhost:3000/cities')
    .then((response) => response.json())
    .then((data) => {
      for (var c in data) {
        store.commit('addCity',{ name: c, geojson: data[c] })
      }
    })
}

fetchRegions()
fetchRivers()
fetchCities()