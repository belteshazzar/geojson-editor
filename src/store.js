
import { createStore } from 'vuex'

const BLANK_GEOJSON = {
  type: 'Feature',
  properties: {
    name: '',
    year: '',
    known_as: '',
    source: '',
    overlay: { url: '', c1: { lat: 0.0, lng: 0.0 }, c2: { lat: 0.0, lng: 0.0 }},
    note: '',
    label: { lat: 0.0, lng: 0.0 },
  },
  geometry: null
};

export const store = createStore({
  state: {
    geojson: Object.assign({}, BLANK_GEOJSON),
  },
  mutations: {
    updateName(state,_name) {
      state.geojson.properties.name = _name
    },
    updateYear(state,_year) {
      state.geojson.properties.year = _year
    },
    updateKnownAs(state,_known_as) {
      state.geojson.properties.known_as = _known_as
    },
    updateSource(state,_source) {
      state.geojson.properties.source = _source
    },
    updateOverlayUrl(state,_url) {
      state.geojson.properties.overlay.url = _url
    },
    updateOverlayC1Lat(state,_lat) {
      state.geojson.properties.overlay.c1.lat = _lat
    },
    updateOverlayC1Lng(state,_lng) {
      state.geojson.properties.overlay.c1.lng = _lng
    },
    updateOverlayC2Lat(state,_lat) {
      state.geojson.properties.overlay.c2.lat = _lat
    },
    updateOverlayC2Lng(state,_lng) {
      state.geojson.properties.overlay.c2.lng = _lng
    },
    updateNote(state,_note) {
      state.geojson.properties.note = _note
    },
    updateLabelLat(state,_lat) {
      state.geojson.properties.label.lat = _lat
    },
    updateLabelLng(state,_lng) {
      state.geojson.properties.label.lng = _lng
    },
    updateGeometry(state,_geometry) {
      state.geojson.geometry = _geometry
    },
  },
  actions: {
    loadOverlay: function() {
    }
  },
  getters: {
    geojson: function (state) {
      return state.geojson;
    }
  }
})
