
import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      xoverlay: { 
        url: '', 
        // first
        c1: {
          lat: -1.4061088354351594,
          lng: 103.88713137376364
        },
        c2: {
          lat: 55.57834467218206,
          lng: -15.292831208745458
        }

        // second
        // c1: {
        //   lat: -17.476432197195518,
        //   lng: 141.4990437358201
        // }, 
        // c2: {
        //   lat: 64.0914075226231,
        //   lng: -12.656121191677354
        // }
      },
      displayYear: 1799,
      loading: true,
      region: {
        type: 'Feature',
        properties: {
          name: '',
          year: 0,
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
      regionYearNext: 0,
      regionYearPrevious: 0,
      city: {},
      cities: {},
      rivers: {},
      river: {}
    }
  },
  mutations: {
    setDisplayYear(state,year) {
      state.displayYear = year
    },
    addRegion(state,geojson) {
      const name = geojson.properties.name.toLowerCase()
      if (!state.regions[name]) state.regions[name] = {}
      state.regions[name][geojson.properties.year] = geojson
      this.dispatch('regionsUpdated')
    },
    setRegion(state,{name,year}) {
      console.log('setRegion',name,year)
      if (state.regionEdited) return
      const geojson = state.regions[name][year]
      if (!geojson) {
        console.error(`region not found: ${name} @ ${year}`)
      } else {

        const years = Object.keys(state.regions[name]).map(v => Number.parseInt(v)).sort((a,b) => a - b)
        const index = years.indexOf(year)
        state.regionYearPrevious = index > 0 ? years[index - 1] : '-'
        state.regionYearNext = index < years.length - 1 ? years[index + 1] : '-'
        state.region = geojson
      }
    },
    resetRegion: function(state) {
      console.log('reset region')
      state.region = {
        type: 'Feature',
        properties: {
          name: '',
          year: 0,
          known_as: '',
          source: '',
          overlay: { url: '', c1: { lat: 0.0, lng: 0.0 }, c2: { lat: 0.0, lng: 0.0 }},
          note: '',
          label: { lat: 0.0, lng: 0.0 },
        },
        geometry: null
      }
      state.regionEdited = false
      this.dispatch('removeOverlay')
    },
    addCity(state,city) {
      state.cities[city.properties.name.toLowerCase()] = city
      this.dispatch('citiesUpdated')

    },
    addRiver(state,river) {
      state.rivers[river.properties.name.toLowerCase()] = river
      this.dispatch('riversUpdated')

    },
    //////////////////////
    updateName(state,_name) {
      state.region.properties.name = _name
      state.regionEdited = true
    },
    updateYear(state,_year) {
      state.region.properties.year = _year
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
    },
    updateOverlayC1(state,{lat,lng}) {
      state.region.properties.overlay.c1.lat = lat
      state.region.properties.overlay.c1.lng = lng
    },
    updateOverlayC2(state,{lat,lng}) {
      state.region.properties.overlay.c2.lat = lat
      state.region.properties.overlay.c2.lng = lng
    },
    xupdateOverlayC1(state,{lat,lng}) {
      state.xoverlay.c1.lat = lat
      state.xoverlay.c1.lng = lng
    },
    xupdateOverlayC2(state,{lat,lng}) {
      state.xoverlay.c2.lat = lat
      state.xoverlay.c2.lng = lng
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
      console.log(JSON.stringify(_geometry))
      try {
      state.region.geometry = _geometry
      state.regionEdited = true
      } catch (e) {
        console.log(e)
      }
    },
  },
  actions: {
    deleteRegion: async function(store) {

      const region = store.getters.region

      await fetch(`http://localhost:3000/regions/${region.properties.name}/${region.properties.year}`,{
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
        delete store.state.regions[region.properties.name.toLowerCase()][`${region.properties.year}`]
        store.commit('resetRegion')
        this.dispatch('regionDeleted',region)
      })
      .catch((error) => {
        alert(error.message);
      });

    },
    saveRegion: async function(store) {

      const region = store.state.region

      await fetch(`http://localhost:3000/regions/${region.properties.name}/${region.properties.year}`,{
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
          console.log(response)
          throw new Error(response.statusText);
        }
        console.log(`region updated ${region.properties.name} @ ${region.properties.year}`)
        if (!store.state.regions[region.properties.name.toLowerCase()]) {
          store.state.regions[region.properties.name.toLowerCase()] = {}
        }
        store.state.regions[region.properties.name.toLowerCase()][`${region.properties.year}`] = region
        store.state.regionEdited = false
        this.dispatch('regionUpdated',region)
      })
      .catch((error) => {
        console.log(error)
        alert('Error:', error);
      });

    },
    xloadOverlay: function() {
    },
    loadOverlay: function() {
    },
    removeOverlay: function() {
    },
    regionsUpdated: function() {
    },
    regionUpdated: function() {
    },
    regionDeleted: function() {
    },
    citiesUpdated: function() {
    },
    riversUpdated: function() {
    }
  },
  getters: {
    region: function (state) {
      return state.region;
    },
    xoverlay: function(state) {
      return state.xoverlay
    }
  }
})

function fetchRegions() {

  fetch('http://localhost:3000/regions')
    .then((response) => response.json())
    .then((data) => {
        for (const name of Object.keys(data)) {
          const region = data[name]
          const years = Object.keys(region.years).map(v => Number.parseInt(v)).sort((a,b) => a - b)

          for (let y=0 ; y<years.length ; y++) {
            const year = years[y]
            const geojson = region.years[year]
            store.commit('addRegion',geojson)
          }
        }
      });
}

function fetchRivers() {
  fetch('http://localhost:3000/rivers')
  .then((response) => response.json())
  .then((data) => {

    for (var r in data) {
      store.commit('addRiver', data[r])
    }
  })

}

function fetchCities() {
  fetch('http://localhost:3000/cities')
    .then((response) => response.json())
    .then((data) => {
      for (var c in data) {
        data[c].geometry.coordinates = [ data[c].geometry.coordinates[0], data[c].geometry.coordinates[1] ]
        store.commit('addCity',data[c])
      }
    })
}

fetchRegions()
fetchRivers()
fetchCities()