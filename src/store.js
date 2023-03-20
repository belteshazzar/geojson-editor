
import { createStore } from 'vuex'

const BLANK_REGION = {
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
};

export const store = createStore({
  state() {
    return {
      display: {
        cities: true,
        rivers: true,
      },
      region: Object.assign({}, BLANK_REGION),
    }
  },
  mutations: {
    updateName(state,_name) {
      state.region.properties.name = _name
    },
    updateYearFrom(state,_year) {
      state.region.properties.year.from = _year
    },
    updateYearTo(state,_year) {
      state.region.properties.year.to = _year
    },
    updateKnownAs(state,_known_as) {
      state.region.properties.known_as = _known_as
    },
    updateSource(state,_source) {
      state.region.properties.source = _source
    },
    updateOverlayUrl(state,_url) {
      state.region.properties.overlay.url = _url
    },
    updateOverlayC1Lat(state,_lat) {
      state.region.properties.overlay.c1.lat = _lat
    },
    updateOverlayC1Lng(state,_lng) {
      state.region.properties.overlay.c1.lng = _lng
    },
    updateOverlayC2Lat(state,_lat) {
      state.region.properties.overlay.c2.lat = _lat
    },
    updateOverlayC2Lng(state,_lng) {
      state.region.properties.overlay.c2.lng = _lng
    },
    updateNote(state,_note) {
      state.region.properties.note = _note
    },
    updateLabelLat(state,_lat) {
      state.region.properties.label.lat = _lat
    },
    updateLabelLng(state,_lng) {
      state.region.properties.label.lng = _lng
    },
    updateGeometry(state,_geometry) {
      state.region.geometry = _geometry
    },
  },
  actions: {
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
