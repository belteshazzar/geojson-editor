import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

import { store } from '../store'
import difference from '@turf/difference'
import {getGeom} from '@turf/invariant'
import booleanContains from '@turf/boolean-contains'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

// let drawnItems = null
let map = null
var editableLayers = null

export function createMap () {

  console.log('createMap')
  map = L.map('map').setView([0, 0], 2)

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  // drawnItems = L.geoJSON(null, {
  //   style: function () {
  //     return {
  //       color: '#666C79'
  //     }
  //   }
  // }).addTo(map)

  editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);

  map.addControl(new L.Control.Draw({
    position: 'topright',
    edit: {
      featureGroup: editableLayers,//drawnItems,
      poly: {
        allowIntersection: false
      }
    },
    draw: {
      polyline: false,
      polygon: {
        allowIntersection: true
      },
      rectangle: false,
      circlemarker: false,
      circle: false
    }
  }))

  map.on('draw:created', function (e) {

    console.log('draw created')

    let geojson;
    let geom;
    let newLayer = e.layer;
    let newGeom = getGeom(newLayer.toGeoJSON());
  
    console.log('new geom')
    console.log(newGeom)

    editableLayers.eachLayer(function (layer) {
      geojson = layer.toGeoJSON();
      if (geojson.type == 'FeatureCollection') {
        geojson = geojson.features[0];
      }
      geom = getGeom(geojson);
      console.log('existing geom')
      console.log(geom)

      if (booleanContains(geom, newGeom)) {
        console.log('contains')
        newGeom = difference(geom, newGeom);
        console.log(newGeom)
        newLayer = L.geoJSON(newGeom);
        editableLayers.removeLayer(layer);
      }
    });

    editableLayers.addLayer(newLayer);

  });


  // map.on('click', clickHandlerForMap)

  // map.on(L.Draw.Event.DRAWSTART, function () {
  //   map.off('click', clickHandlerForMap)
  // })

  // map.on(L.Draw.Event.DRAWSTOP, function () {
  //   map.on('click', clickHandlerForMap)
  // })

  // map.on(L.Draw.Event.CREATED, function (event) {
  //   editableLayers.addLayer(event.layer)
  //   parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  // })

  map.on(L.Draw.Event.EDITED, function () {
    parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  })

  map.on(L.Draw.Event.DELETED, function () {
    parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  })
  console.log('map added')
}

// function clickHandlerForMap () {
//   store.commit('setSelectedProperties', {
//     properties: null
//   })
//   resetStyleOfPreviousSelection()
//   lastSelectedFeature = null
// }


function parseGeoJSONAndSendToStore (geojson) {
  console.log('geojson',geojson)
  store.commit('updateGeometry', geojson.geometry)
}

// let lastSelectedFeature = null

// function highlightSelectedFeature () {
//   lastSelectedFeature.setStyle({
//     color: '#fedc7f'
//   })
// }

// function resetStyleOfPreviousSelection () {
//   if (lastSelectedFeature === null) return
//   lastSelectedFeature.setStyle({
//     color: '#666C79'
//   })
// }

// function openPopup(e) {
//   L.DomEvent.stop(e);
//   resetStyleOfPreviousSelection()
//   lastSelectedFeature = e.target
//   highlightSelectedFeature()
// //  store.commit('setSelectedProperties', lastSelectedFeature.feature)
// }

export function zoomToFeatures () {
   map.fitBounds(editableLayers.getBounds())
}

export function modifyGeoJSON () {
  console.log(store)

  // editableLayers.clearLayers()
  // editableLayers.addData(store.getters.geojson)
  // editableLayers.eachLayer(function (layer) {
  //   layer.on('click', openPopup)
  // })
}
