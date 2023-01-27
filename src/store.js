//import Vuex from 'vuex'
//import Vue from 'vue'
// import { modifyGeoJSON } from './controllers/leafletMap'
//import { highlightSelectedFeatureInCodeArea } from './controllers/codeMirror'

//Vue.use(Vuex)

import { createStore } from 'vuex'

const BLANK_GEOJSON = {
  type: 'Feature',
  properties: {
    name: '',
    year: '',
    known_as: '',
    source: '',
    note: '',
    label_x: 0.0,
    label_y: 0.0,
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
    updateNote(state,_note) {
      state.geojson.properties.note = _note
    },
    updateLabelX(state,_label_x) {
      state.geojson.properties.label_x = _label_x
    },
    updateLabelY(state,_label_y) {
      state.geojson.properties.label_y = _label_y
    },
    updateGeometry(state,_geometry) {
      console.log('update geometry',_geometry)
      state.geojson.geometry = _geometry
    },
  },
  getters: {
    geojson: function (state) {
      return state.geojson;
    },
  }
})
