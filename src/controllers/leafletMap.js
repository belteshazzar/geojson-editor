import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

import store from '../store'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

let drawnItems = null
let map = null

export function createMap () {
  map = L.map('map').setView([0, 0], 2)

  const tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  drawnItems = L.geoJSON(null, {
    style: function () {
      return {
        color: '#666C79'
      }
    }
  }).addTo(map)

  map.addControl(new L.Control.Draw({
    position: 'topright',
    edit: {
      featureGroup: drawnItems,
      poly: {
        allowIntersection: false
      }
    },
    draw: {
      polygon: {
        allowIntersection: false
      },
      circlemarker: false,
      circle: false
    }
  }))

  map.on('click', clickHandlerForMap)

  map.on(L.Draw.Event.DRAWSTART, function (event) {
    map.off('click', clickHandlerForMap)
  })

  map.on(L.Draw.Event.DRAWSTOP, function () {
    map.on('click', clickHandlerForMap)
  })

  map.on(L.Draw.Event.CREATED, function (event) {
    drawnItems.addLayer(event.layer)
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

  map.on(L.Draw.Event.EDITED, function () {
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

  map.on(L.Draw.Event.DELETED, function () {
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

}

function clickHandlerForMap () {
  store.commit('setSelectedProperties', {
    properties: null
  })
  resetStyleOfPreviousSelection()
  lastSelectedFeature = null
}


function parseGeoJSONAndSendToStore (geojson) {
  store.commit('setGeoJSON', geojson)
}

let lastSelectedFeature = null

function highlightSelectedFeature () {
  lastSelectedFeature.setStyle({
    color: '#fedc7f'
  })
}

function resetStyleOfPreviousSelection () {
  if (lastSelectedFeature === null) return
  lastSelectedFeature.setStyle({
    color: '#666C79'
  })
}

function openPopup(e) {
  L.DomEvent.stop(e);
  resetStyleOfPreviousSelection()
  lastSelectedFeature = e.target
  highlightSelectedFeature()
  store.commit('setSelectedProperties', lastSelectedFeature.feature)
}

export function zoomToFeatures () {
   map.fitBounds(drawnItems.getBounds())
}

export function modifyGeoJSON () {

  drawnItems.clearLayers()
  drawnItems.addData(store.getters.geojson)
  drawnItems.eachLayer(function (layer) {
    layer.on('click', openPopup)
  })
}
