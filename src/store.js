//import Vuex from 'vuex'
//import Vue from 'vue'
import { modifyGeoJSON } from './controllers/leafletMap'
//import { highlightSelectedFeatureInCodeArea } from './controllers/codeMirror'

//Vue.use(Vuex)

import { createStore } from 'vuex'

export const store = createStore({
  state: {
    geojson: {
      properties: [],
      features: []
    },
  },
  mutations: {
    setGeoJSON (state, newGeojson) {
      console.log(newGeojson)
      state.geojson = newGeojson
      modifyGeoJSON()
    },
  },
  getters: {
    geojson: function (state) {
      return state.geojson;
      // return JSON.parse(state.geojsonString)
    },
  //   featureCount: function (state) {
  //     const gj = JSON.parse(state.geojsonString)
  //     if (gj.type === 'FeatureCollection') return gj.features.length
  //     if (gj.type === 'GeometryCollection') return gj.geometries.length
  //     if (gj.type === 'Feature' || gj.type === 'Geometry') return 1
  //     return 0
  //   }
  }
})
