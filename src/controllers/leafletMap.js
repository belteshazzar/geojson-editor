import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

//import 'leaflet-distortableimage'
import { store } from '../store'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

let map = null
let drawnItems = null
var label = null

// overlay
var overlay = null
var corner1 = null
var corner2 = null
var bounds = null
var m1 = null
var m2 = null

export function createMap (store) {

  // sumer source: https://en.wikipedia.org/wiki/Lugal-zage-si
  // sumer image: https://upload.wikimedia.org/wikipedia/commons/d/dd/Sumer_%28map%29.jpg

  store.subscribeAction((action) => {
    if (action.type == 'removeOverlay') {
      console.log('remove overlay from: ' + action.payload)

      if (overlay != null) {
        map.removeLayer(overlay)
        map.removeLayer(m1)
        map.removeLayer(m2)
      }
    } else if (action.type == 'loadOverlay') {
      console.log('load overlay from: ' + action.payload)

      if (overlay != null) {
        map.removeLayer(overlay)
        map.removeLayer(m1)
        map.removeLayer(m2)
      }

      const imageUrl = action.payload

      if (imageUrl == '') return
    //   const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Umma2350.PNG'


    // https://en.wikipedia.org/wiki/Kingdom_of_Kush
    // https://upload.wikimedia.org/wikipedia/commons/0/07/Kushite_heartland_and_Kushite_Empire_of_the_25th_dynasty_circa_700_BCE.jpg

    const region = store.getters.region
    console.log(region)
    if (region.properties.overlay.c1.lat
      && region.properties.overlay.c1.lng
      && region.properties.overlay.c2.lat
      && region.properties.overlay.c2.lng) {

     corner1 = L.latLng(region.properties.overlay.c1.lat, region.properties.overlay.c1.lng)
     corner2 = L.latLng(region.properties.overlay.c2.lat, region.properties.overlay.c2.lng)
     bounds = L.latLngBounds(corner1, corner2)
  } else {
      bounds = map.getBounds()
      corner1 = bounds.getSouthEast()
      corner2 = bounds.getNorthWest()  
    }

     m1 = new L.Marker(corner1,{
        draggable: true
     })
     m1.on('drag', function(e) {
      corner1.lat = e.latlng.lat
      corner1.lng = e.latlng.lng
      bounds = L.latLngBounds(corner1,corner2)
      overlay.setBounds(bounds)
      store.commit('updateOverlayC1Lat',corner1.lat)
      store.commit('updateOverlayC1Lng',corner1.lng)
     })
     m1.addTo(map);
     m1._icon.classList.add("huechange2")

     m2 = new L.Marker(corner2,{
      draggable: true
     })

     m2.on('drag', function(e) {
      corner2.lat = e.latlng.lat
      corner2.lng = e.latlng.lng
      bounds = L.latLngBounds(corner1,corner2)
      overlay.setBounds(bounds)

      store.commit('updateOverlayC2Lat',corner2.lat)
      store.commit('updateOverlayC2Lng',corner2.lng)
  
     })
     m2.addTo(map);
     m2._icon.classList.add("huechange2")

      map.fitBounds(bounds);
      overlay = new L.ImageOverlay(imageUrl, bounds, {
          opacity: 0.7,
          interactive: true
      });
      map.addLayer(overlay);
    
     store.commit('updateOverlayC1Lat',corner1.lat)
     store.commit('updateOverlayC1Lng',corner1.lng)
     store.commit('updateOverlayC2Lat',corner2.lat)
     store.commit('updateOverlayC2Lng',corner2.lng)

    }
  })


  map = L.map('map',{editable:true}).setView([0, 0], 2)

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
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

  label = new L.Marker([0.0,0.0],{
    draggable: true
   })
  label.addTo(map)

  label._icon.classList.add("huechange")

  fetch('http://localhost:3000/cities')
    .then((response) => response.json())
    .then((data) => {

      for (var c in data) {
          new L.Marker(data[c].geometry.coordinates,{
            }).bindTooltip(data[c].properties.name, {
                // permanent: true, 
                direction: 'right'
            }).addTo(map).on('click',() => {
              console.log(data[c])
            })
      }
  })

  fetch('http://localhost:3000/rivers')
    .then((response) => response.json())
    .then((data) => {

      for (var r in data) {
          L.geoJSON(data[r]).addTo(map);
      }
  })

  map.addControl(new L.Control.Draw({
    position: 'topright',
    edit: {
      featureGroup: drawnItems,
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
    const newLayer = e.layer;
    const newGeoJSON = newLayer.toGeoJSON()

    if (drawnItems.getLayers().length == 0) {

      store.commit('updateGeometry', newGeoJSON.geometry)

    } else if (drawnItems.getLayers().length != 1) {
      console.error('there should be onw layer')
      return
      
    } else {

      const geom = {
        type: 'MultiPolygon',
        coordinates: []
      }

      drawnItems.getLayers().forEach((layer) => {
        const geojson = layer.toGeoJSON()
        if (geojson.geometry.type == 'Polygon') {
          geom.coordinates.push(geojson.geometry.coordinates)
        } else if (geojson.geometry.type == 'MultiPolygon') {

          geojson.geometry.coordinates.forEach((coords) => {
            geom.coordinates.push(coords)
          })

        } else {
          console.error('expected layer to be Polygon or MultiPolygon but was: ' + geojson.geometry.type)
          return
        }
      })

      geom.coordinates.push(newGeoJSON.geometry.coordinates)

      store.commit('updateGeometry', geom)

    }

  });

  function convertToPolygons() {
    drawnItems.clearLayers();
    const geojson = store.getters.geojson

    if (geojson.geometry.type == 'Polygon') {
      drawnItems.addData(geojson)
    } else if (geojson.geometry.type == 'MultiPolygon') {

      geojson.geometry.coordinates.forEach((coords) => {
        drawnItems.addData({
          type : 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: coords
          }
        })
      })
    } else {
      console.error('only polygon and multipolygon supported')
      return
    }
  }

  function convertToMultiPolygons() {

    if (drawnItems.getLayers().length == 0) {

      store.commit('updateGeometry', null)

    } else if (drawnItems.getLayers().length == 1) {

      // assuming its a polygon
      store.commit('updateGeometry',drawnItems.getLayers()[0].toGeoJSON().geometry)

    } else {

      let geometry = {
        type: 'MultiPolygon',
        coordinates: []
      }

      drawnItems.getLayers().forEach((layer) => {
        geometry.coordinates.push(layer.toGeoJSON().geometry.coordinates)
      })

      store.commit('updateGeometry',geometry)
    }

  }

  // MultiPolygon editing doesn't work
  // so convert to polygons
  map.on(L.Draw.Event.EDITSTART, convertToPolygons)
  map.on(L.Draw.Event.DELETESTART, convertToPolygons)

  // MultiPolygon editing doesn't work
  // so convert to polygons and back on stop
  map.on(L.Draw.Event.EDITSTOP, convertToMultiPolygons)
  map.on(L.Draw.Event.DELETESTOP, convertToMultiPolygons)

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

  // map.on(L.Draw.Event.EDITED, function () {
  //   console.log("edited")
  //   parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  // })

  label.on('drag',function() {
    store.commit('updateLabelLat',label.getLatLng().lng)
    store.commit('updateLabelLng',label.getLatLng().lat)
  })

  // map.on(L.Draw.Event.DELETED, function () {
  //   console.log("deleted")
  //   parseGeoJSONAndSendToStore(editableLayers.toGeoJSON())
  // })

}

// function parseGeoJSONAndSendToStore (geojson) {
//   console.log('parseGeoJSONAndSendToStore',geojson)
//   store.commit('updateGeometry', geojson.geometry)
// }

// export function zoomToFeatures () {
//    map.fitBounds(editableLayers.getBounds())
// }

export function modifyRegionLabel() {
  const region = store.getters.region
  // const name = region.properties.name
  const lng = region.properties.label.lat
  const lat = region.properties.label.lng
  label.setLatLng([lat,lng])  
}

export function modifyRegionGeometry () {
  drawnItems.clearLayers();
  const region = store.getters.region

  if (region.type != 'Feature') {
    console.error('only geojson features supported')
    return
  }

  drawnItems.addData(region)
}

export function loadOverlay() {
  console.log("loadOverlay")
}

export function modifyRegionOverlay() {
  console.log('modifyRegionOverlay')
  // if (store.getters.geojson.properties.overlay) {
  //   const data = store.getters.geojson.properties.overlay

  //   console.log(data)

  //   if (data.c1 && data.c2) {
  //     corner1.lat = data.c1.lat
  //     corner1.lng = data.c1.lng
  //     corner2.lat = data.c2.lat
  //     corner2.lng = data.c2.lng
  //     bounds = L.latLngBounds(corner1,corner2)
  //     overlay.setBounds(bounds)
  //   }
  // }
}
