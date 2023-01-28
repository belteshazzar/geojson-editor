import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

import { store } from '../store'
// import difference from '@turf/difference'
// import combine from '@turf/combine'
// import {getGeom} from '@turf/invariant'
// import booleanContains from '@turf/boolean-contains'
// import booleanContains from '@turf/boolean-contains'

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
var label = null

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

  label = new L.Marker([0.0,0.0],{
    draggable: true
   })
  label.addTo(map)

  map.addControl(new L.Control.Draw({
    position: 'topright',
    edit: {
      featureGroup: editableLayers,//drawnItems,
      poly: {
        allowIntersection: false
      }
    },
    draw: {
      marker: false,
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
    console.log('-- draw:created -----------')
    // let geojson;
    // let geom;
    console.log(e)
    const newLayer = e.layer;
    const newGeoJSON = newLayer.toGeoJSON()
    const newGeom = newGeoJSON.geometry//getGeom(newGeoJSON);

    if (editableLayers.getLayers().length > 2) {
      console.error('more than one existing layer')
    }

    const existingLayer = editableLayers.getLayers()[0]
    if (existingLayer != null) {

      let existingGeoJSON = existingLayer.toGeoJSON()
      if (existingGeoJSON.type == 'FeatureCollection') {
        console.log('feature collection => feature')

        if (existingGeoJSON.features.length == 0) {
          store.commit('updateGeometry', newGeom)
          return
        } else if (existingGeoJSON.features.length != 1) {
          console.error('more than one feature',existingGeoJSON)
          return
        }
        existingGeoJSON = existingGeoJSON.features[0]
      }

      const existingGeom = existingGeoJSON.geometry // getGeom(existingGeoJSON)


      // combine into multi polygon

      if (existingGeom.type == 'Polygon') {
  
        let geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              existingGeom.coordinates,
              newGeom.coordinates
            ]
          }
        }
        // editableLayers.removeLayer(existingLayer)
        // editableLayers.addLayer(L.geoJSON(geojson))
        store.commit('updateGeometry', geojson.geometry)

      } else if (existingGeom.type == 'MultiPolygon') {

        let geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: existingGeom.coordinates
          }
        }
        geojson.geometry.coordinates.push(newGeom.coordinates)

        // editableLayers.removeLayer(existingLayer)
        // editableLayers.addLayer(L.geoJSON(geojson))
        store.commit('updateGeometry', geojson.geometry)

      } else {
        console.error('unknown existing geom type: ' + existingGeom.type)
      }
    } else {

      // editableLayers.addLayer(L.geoJSON(newGeoJSON));
      store.commit('updateGeometry', newGeom)

    }
  
    // editableLayers.eachLayer(function (layer) {
    //   geojson = layer.toGeoJSON();
    //   if (geojson.type == 'FeatureCollection') {
    //     geojson = geojson.features[0];
    //   }
    //   geom = getGeom(geojson);

    //   if (booleanContains(geom, newGeom)) {
    //     newGeom = difference(geom, newGeom);
    //     newLayer = L.geoJSON(newGeom);
    //     editableLayers.removeLayer(layer);
    //   }
    // });

    // editableLayers.eachLayer(function (layer) {
    //   console.log('existing layer',layer.toGeoJSON())
    //   console.log('new layer',newGeom)
    //   console.log('existing',layer.toGeoJSON().geometry)
    //   newGeom = combine(layer.toGeoJSON(),newLayer)
    //   console.log('new geom',newGeom)
    //   if (newGeom.type == 'FeatureCollection') {
    //     console.log('feature collection')
    //     newGeom = newGeom.features[0]
    //   }
    //   newLayer = L.geoJSON(newGeom)
    //   editableLayers.removeLayer(layer);
    // })
    // console.log(newLayer.toGeoJSON())

    

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
    console.log("edited")
    parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  })

  label.on('drag',function() {
    console.log('drag')
    console.log(label.getLatLng())
    store.commit('updateLabelX',label.getLatLng().lng)
    store.commit('updateLabelY',label.getLatLng().lat)
  })

  map.on(L.Draw.Event.DELETED, function () {
    console.log("deleted")
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
  console.log('parseGeoJSONAndSendToStore',geojson)
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

export function modifyLabel() {
  const geojson = store.getters.geojson
  const name = geojson.properties.name
  const lng = geojson.properties.label_x
  const lat = geojson.properties.label_y
  console.log(name,lat,lng)
  label.setLatLng([lat,lng])
  
}

export function modifyGeoJSON () {
  console.log('modifyGeoJSON',store)

  editableLayers.clearLayers()
  let newLayer = L.geoJSON(store.getters.geojson);
  editableLayers.addLayer(newLayer);
  // editableLayers.addData(store.getters.geojson)
  // editableLayers.eachLayer(function (layer) {
  //   layer.on('click', openPopup)
  // })
}
