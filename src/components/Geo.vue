<template>
  <div class="geo">
    <div id="map" />
    <div id="slider">
      <div id="yearText" v-text="yearText"></div>
      <div>
        <button @click="index = index*1 - 100">-100</button>
        <button @click="index = index*1 - 10">-10</button>
        <button @click="index = index*1 - 1">-1</button>
        <input type="range" min="-3500" max="2020" step="1" v-model="index" />
        <button @click="index = index*1 + 1">+1</button>
        <button @click="index = index*1 + 10">+10</button>
        <button @click="index = index*1 + 100">+100</button>
      </div>
      <div>
        <label for="showCities">Show Continents: </label>
        <input type="checkbox" v-model="continents" />
        <label for="showCities">Show Cities: </label>
        <input type="checkbox" v-model="cities" />
        <label for="showRivers">Show Rivers: </label>
        <input type="checkbox" v-model="rivers" />
      </div>
    </div>
  </div>
</template>

<script>

// TODO: snapping https://www.npmjs.com/package/@geoman-io/leaflet-geoman-free#snapping


// import { updateVisibility,createMap,modifyRegionGeometry,modifyRegionLabel,modifyRegionOverlay } from './../controllers/leafletMap'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// import 'leaflet-draw'
// import 'leaflet-draw/dist/leaflet.draw.css'

import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import union from '@turf/union'
import inside from '@turf/boolean-point-in-polygon'

//import 'leaflet-distortableimage'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

var createPixelGIF = (function() {

  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  return function createPixelGIF(hexColor) {
    return "data:image/gif;base64,R0lGODlhAQABAPAA" + encodeHex(hexColor) + "/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  }

  function encodeHex(hexColor) {
    var rgb;
    if (typeof hexColor == 'string') {
      var s = hexColor.substring(1, 7);
      if (s.length < 6) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
      rgb = [parseInt(s[0] + s[1], 16), parseInt(s[2] + s[3], 16), parseInt(s[4] + s[5], 16)];
    } else
      rgb = [(hexColor & (0xFF << 16)) >> 16, (hexColor & (0xFF << 8)) >> 8, hexColor & 0xFF];

    return encodeRGB(rgb[0], rgb[1], rgb[2]);
  }

  function encodeRGB(r, g, b) {
    return encode_triplet(0, r, g) + encode_triplet(b, 255, 255);
  }

  function encode_triplet(e1, e2, e3) {
    let enc1 = e1 >> 2;
    let enc2 = ((e1 & 3) << 4) | (e2 >> 4);
    let enc3 = ((e2 & 15) << 2) | (e3 >> 6);
    let enc4 = e3 & 63;
    return keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }

})()

const C_GREEK = "#ff33e4" // pink
const C_SYRO_HITTITE = '#14ff20' // bright green
const C_GULF = '#fbff00' // bright yellow
const C_EGYPT = '#d9bf30' // gold
const C_CHINA = '#a80c0c' // dark red
const C_ARABIA= '#f5e97d' // sandy

const colors = {
  aramea: C_GULF,
  achaemenid: '#2c7332', // dark green
  armenia: '#f0940a',
  arzawa: C_SYRO_HITTITE,
  assyria: '#031194', // blue
  ba: C_CHINA,
  babylonia: '#a61d1b', // red
  'bosporan kingdom': '#5c3610',
  canaan: '#9c4c27',
  'china states': C_CHINA,
  chu: C_CHINA,
  colchis: C_SYRO_HITTITE,
  'delian league': C_GREEK,
  dilmun: C_GULF,
  egypt: C_EGYPT,
  elam: '#2c7332', // dark green
  epirus: C_GREEK,
  gojoseon: C_CHINA,
  'greek-state': C_GREEK,
  'greek-state-a': C_GREEK,
  'greek-state-gg': C_GREEK,
  'greek egypt': C_GREEK,
  'greco-bactria': C_GREEK,
  hadra: C_ARABIA,
  hittites: '#ab6605', // orange brown
  hyksos: C_EGYPT,
  jin: C_CHINA,
  'kingdom of kush': C_EGYPT,
  meroe: C_EGYPT,
  lydia: C_SYRO_HITTITE,
  'lower egypt': C_EGYPT,
  macedon: C_GREEK,
  macedonia: C_GREEK,
  magan: C_GULF,
  medes: '#2c7332', // dark green
  minoan: '#804200',
  minaea: C_ARABIA,
  minyue: C_CHINA,
  mycenae: C_GREEK,
  mitanni: '#ffa200', // bright orange
  nubia: C_EGYPT,
  phoenicia: '#6e4229', // brown
  phrygia: C_SYRO_HITTITE,
  punt: C_EGYPT, // gold
  qataban: C_ARABIA,
  qin: C_CHINA,
  qi: C_CHINA,
  'roman empire': '#5406ba',
  saba: C_ARABIA,
  shang: C_CHINA,
  shu: C_CHINA,
  syria: C_SYRO_HITTITE,
  tabal: '#14ff20', // fluro green
  thrace: C_GREEK,
  ugarit: C_SYRO_HITTITE,
  'upper egypt': C_EGYPT,
  uratu: '#ff9500', // bright orange
  wei: C_CHINA,
  xia: C_CHINA,
  xios: C_EGYPT,
  yan: C_CHINA,
  zhou: C_CHINA,
  zhao: C_CHINA
}

var cityIcon = L.icon({
    iconUrl: createPixelGIF(0xff0000),
    // shadowUrl: 'leaf-shadow.png',

    iconSize:     [3, 3], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [1, 1], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

let map = null
let continentsLayer = null
let continentLayers = {}
let regionsLayer = null
let regionLayers = {}
let citiesLayer = null
let cityLayers = {}
let riversLayer = null
let riverLayers = {}

// let rivers = L.layerGroup()
// let cities = L.layerGroup()
let drawnItems = null
var label = null

// overlay
var overlay = null
var corner1 = null
var corner2 = null
var bounds = null
var m1 = null
var m2 = null

// overlay
var xoverlay = null
var xcorner1 = null
var xcorner2 = null
var xbounds = null
var xm1 = null
var xm2 = null

function debounce(cb, delay = 250) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

// layer._from = geojson.properties.year
//       layer._to = nextGeoJson == null ? Number.POSITIVE_INFINITY : nextGeoJson.properties.year - 1

function createLayer(store, geojson) {

  let layer = L.geoJSON(geojson)
  layer.pm.setOptions({ allowEditing: false })
  layer._name = geojson.properties.name.toLowerCase()
  layer._geojson = geojson

  let color = colors[`${layer._name}`]

  if (color) {
    layer.setStyle({fillColor: color, color: color});
  } else {
    layer.setStyle({fillColor: '#0000FF', color: '#0000FF'});
  }

  layer.on('click',function(ev) {
    if (ev.originalEvent.shiftKey) {
      const geom1 = store.state.region.geometry
      const geom2 = geojson.geometry
      if (geom1==null) {
        store.commit('updateGeometry',geom2)
      } else {
        const ll = {type:'Point',coordinates:[ev.latlng.lng,ev.latlng.lat]}

        console.log('shift click',geom1,geom2)

        if (geom2.type == 'MultiPolygon') {
          console.log('click on multi polygon')
          console.log(ll)
          for (var i=0 ; i<geom2.coordinates.length ; i++) {
            const coords = geom2.coordinates[i]
            var poly={'type':'Polygon','coordinates':coords};
            console.log(inside(ll,poly))
            if (inside(ll,poly)) {
              let u = union(geom1, poly);
              store.commit('updateGeometry',u.geometry)
              break
            }
          }
        } else if (geom2.type == 'Polygon') {
          let u = union(geom1, geom2);
          store.commit('updateGeometry',u.geometry)
        }
      }
    } else {
      store.commit('setRegion',{name: layer._name,year:layer._from})
    }
  });

  return layer
}

const riversUpdated = debounce((component) => {
  const store = component.$store

  for (const name of Object.keys(store.state.rivers)) {
    let layer = riverLayers[name]
    if (!layer) {
      const geojson = store.state.rivers[name]
      layer = L.geoJSON(geojson)
      layer.pm.setOptions({ allowEditing: false })
      layer._name = name
      layer._geojson = geojson
            layer.setStyle({weight: 2})
            // layer._river = river
            layer.on('click',function() {
              store.commit('setRiver',geojson)
            });
            layer.bindPopup(name);
            layer.on('mouseover', function () {
                this.openPopup();
            });
            layer.on('mouseout', function () {
                this.closePopup();
            });
    riverLayers[name] = layer
      riversLayer.addLayer(layer)




    }
  }
})

const citiesUpdated = debounce((component) => {
  const store = component.$store

  for (const name of Object.keys(store.state.cities)) {
    let layer = cityLayers[name]
    if (!layer) {
      const geojson = store.state.cities[name]
      // layer = L.geoJSON(geojson)
      // layer.pm.setOptions({ allowEditing: false })
      // layer._name = name
      // layer._geojson = geojson

            const marker = L.marker(geojson.geometry.coordinates, {icon: cityIcon})
            marker._city = geojson
            marker.on('click',function() {
              store.commit('setCity',geojson)
            });
            marker.bindPopup(name);
            marker.on('mouseover', function () {
                this.openPopup();
            });
            marker.on('mouseout', function () {
                this.closePopup();
            });



      cityLayers[name] = marker
      citiesLayer.addLayer(marker)
    }
  }
})

function calculateFromToRegion(region) {

console.log('calculateFromToRegion')
console.log(region)

  const years = Object.keys(region).map(v => Number.parseInt(v)).sort((a,b) => a - b)

  for (let i=0 ; i<years.length ; i++) {
    const geojson = region[`${years[i]}`]
    const name = geojson.properties.name.toLowerCase()
    if (geojson.geometry == null) continue
    let layer = regionLayers[name][`${geojson.properties.year}`]
    const nextGeoJson = i<years.length-1 ? region[`${years[i+1]}`] : null
    layer._from = geojson.properties.year
    layer._to = nextGeoJson == null ? Number.POSITIVE_INFINITY : nextGeoJson.properties.year - 1

  }

}

// function calculateFromTo(component) {
//   console.log('calculateFromTo')

//   const store = component.$store

//   for (const name of Object.keys(store.state.regions)) {
//     calculateFromToRegion(store.state.regions[name])
//   }

// }

const regionsUpdated = debounce((component) => {

  console.log('regionsUpdated')
  // TODO: only adds, should also remove
  
  const store = component.$store
  console.log(component)

  for (const name of Object.keys(store.state.regions)) {

    if (name.startsWith('continent - ')) {
      let layer = continentLayers[name]
      if (!layer) {
        const geojson = store.state.regions[name][Object.keys(store.state.regions[name])[0]]
        layer = L.geoJSON(geojson)
        layer.pm.setOptions({ allowEditing: false })
        layer._name = name
        layer._geojson = geojson
        layer.setStyle({fillColor: '#104f05', color: '#104f05'});
        continentLayers[name] = layer
        continentsLayer.addLayer(layer)
      }
      continue
    }

    if (!regionLayers[name]) {
      regionLayers[name] = {}
    }

    const region = store.state.regions[name]
    if (!region) {
      console.error('region ',name,region)
      continue
    }

    const years = Object.keys(region).map(v => Number.parseInt(v)).sort((a,b) => a - b)

    for (let i=0 ; i<years.length ; i++) {
      const geojson = region[`${years[i]}`]
      if (geojson.geometry == null) continue

      let layer = regionLayers[name][`${geojson.properties.year}`]
      if (!layer) {
        layer = createLayer(store,geojson)
        regionLayers[name][`${geojson.properties.year}`] = layer
      }

    }

    calculateFromToRegion(region)
  }

  component.updateVisibility()

},1000)

function regionDeleted(component,geojson) {
  console.log('regionDeleted: ',geojson.properties.name,geojson.properties.year)
  const store = component.$store
  const name = geojson.properties.name.toLowerCase()
  const year = geojson.properties.year

  let layer = regionLayers[name][`${year}`]
  if (layer) {
      regionsLayer.removeLayer(layer)
      delete regionLayers[name][`${year}`]

      calculateFromToRegion(store.state.regions[name])
  } else {
    console.error(`regionDeleted: not found ${geojson.properties.name} @ ${geojson.properties.year}`)
  }

}

function regionUpdated(component,geojson) {
  console.log('regionUpdated: ',geojson.properties.name,geojson.properties.year)
  const store = component.$store
  const name = geojson.properties.name.toLowerCase()
  const region = store.state.regions[name]

  if (!region) {
    console.error(`regionUpdated: name not found ${geojson.properties.name} @ ${geojson.properties.year}`)
    return
  }

  const years = Object.keys(region).map(v => Number.parseInt(v)).sort((a,b) => a - b)

  for (let i=0 ; i<years.length ; i++) {
    if (years[i] == geojson.properties.year) {
      const geojson = region[`${years[i]}`]

      let layer = regionLayers[name][`${geojson.properties.year}`]
      if (layer) {
        regionsLayer.removeLayer(layer)
      }

      if (geojson.geometry) {
        regionLayers[name][`${geojson.properties.year}`] = createLayer(store,geojson)
      }
      regionsUpdated(component)

      return
      // if (found) {
      //   layer._from = geojson.properties.year
      //   layer._to = nextGeoJson == null ? Number.POSITIVE_INFINITY : nextGeoJson.properties.year - 1
      //   continue
      // }
    }
  }

  console.error(`regionUpdated: year not found ${geojson.properties.name} @ ${geojson.properties.year}`)

}

function createMap (component) {

  // sumer source: https://en.wikipedia.org/wiki/Lugal-zage-si
  // sumer image: https://upload.wikimedia.org/wikipedia/commons/d/dd/Sumer_%28map%29.jpg

  const store = component.$store

  store.subscribeAction((action) => {
    if (action.type == 'regionsUpdated') {
      regionsUpdated(component)
    } else if (action.type == 'regionUpdated') {
      regionUpdated(component,action.payload)
    } else if (action.type == 'regionDeleted') {
      regionDeleted(component,action.payload)
    } else if (action.type == 'citiesUpdated') {
      citiesUpdated(component)
    } else if (action.type == 'riversUpdated') {
      riversUpdated(component)
    } else if (action.type == 'xremoveOverlay') {
      console.log('remove overlay from: ' + action.payload)

      if (xoverlay != null) {
        map.removeLayer(xoverlay)
        map.removeLayer(xm1)
        map.removeLayer(xm2)
      }
    } else if (action.type == 'removeOverlay') {
      console.log('remove overlay from: ' + action.payload)

      if (overlay != null) {
        map.removeLayer(overlay)
        map.removeLayer(m1)
        map.removeLayer(m2)
      }
    } else if (action.type == 'xloadOverlay') {

      if (xoverlay != null) {
        map.removeLayer(xoverlay)
        map.removeLayer(xm1)
        map.removeLayer(xm2)
      }

      const imageUrl = action.payload

      if (imageUrl == '') return

      const state = store.getters.xoverlay
      xcorner1 = L.latLng(state.c1.lat, state.c1.lng)
      xcorner2 = L.latLng(state.c2.lat, state.c2.lng)
      xbounds = L.latLngBounds(xcorner1, xcorner2)

     xm1 = new L.Marker(xcorner1,{
        draggable: true
     })
     xm1.on('drag', function(e) {
      xcorner1.lat = e.latlng.lat
      xcorner1.lng = e.latlng.lng
      xbounds = L.latLngBounds(xcorner1,xcorner2)
      xoverlay.setBounds(xbounds)
      store.commit('xupdateOverlayC1',{lat:xcorner1.lat,lng:xcorner1.lng})
     })
     xm1.addTo(map);
     xm1._icon.classList.add("huechange2")

     xm2 = new L.Marker(xcorner2,{
      draggable: true
     })

     xm2.on('drag', function(e) {
        xcorner2.lat = e.latlng.lat
        xcorner2.lng = e.latlng.lng
        xbounds = L.latLngBounds(xcorner1,xcorner2)
        xoverlay.setBounds(xbounds)

        store.commit('xupdateOverlayC2',{lat:xcorner2.lat,lng:xcorner2.lng})
     })
     xm2.addTo(map);
     xm2._icon.classList.add("huechange2")

      // map.fitBounds(bounds);
      xoverlay = new L.ImageOverlay(imageUrl, xbounds, {
          opacity: 0.7,
          interactive: true
      });
      map.addLayer(xoverlay);
    
     store.commit('xupdateOverlayC1',{lat:xcorner1.lat,lng:xcorner1.lng})
     store.commit('xupdateOverlayC2',{lat:xcorner2.lat,lng:xcorner2.lng})

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
      store.commit('updateOverlayC1',{lat:corner1.lat,lng:corner1.lng})
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

      store.commit('updateOverlayC2',{lat:corner2.lat,lng:corner2.lng})
  
     })
     m2.addTo(map);
     m2._icon.classList.add("huechange2")

      // map.fitBounds(bounds);
      overlay = new L.ImageOverlay(imageUrl, bounds, {
          opacity: 0.7,
          interactive: true
      });
      // overlay.on('click',function(e) {
      //   const offsetX = e.originalEvent.offsetX
      //   const offsetY = e.originalEvent.offsetY
      //   const img = e.target._image
      //   var canvas = document.createElement("canvas");
      //   canvas.width = img.width;
      //   canvas.height = img.height;
      //   var context = canvas.getContext('2d');
      //   try {
      //     context.drawImage(img, 0, 0, img.width,img.height );
      //     const imgData = context.getImageData(0, 0, img.width, img.height)
      //     const data = imgData.data
      //     const index = 4*(offsetY * img.width + offsetX)
      //     const color = [
      //       data[index],
      //       data[index + 1],
      //       data[index + 2],
      //       data[index + 3]
      //   ]
      //     const outline = getOutline(data,offsetX,offsetY,img.width,img.height,color)
      //     console.log(outline)

      //     data[index] = 255
      //     data[index + 1] = 0
      //     data[index + 2] = 0
      //     data[index + 3] = 255

      //     let coords = []
      //     outline.forEach(p => {
      //       const x = p.x
      //       const y = p.y
      //       const i = 4*(y * img.width + x)
      //       data[i]=255
      //       data[i+1]=0
      //       data[i+2]=0
      //       data[i+3]=255
      //       const ll = map.unproject(L.point(x,y),map.getZoom())
      //       coords.push([ll.lng,ll.lat])
      //     })
      //     store.commit('updateGeometry',{"type":"Polygon","coordinates":[coords]})
      //     context.putImageData(imgData, 0, 0);
      //     var base64URI = canvas.toDataURL();
      //     img.src = base64URI
      //   } catch (e) {
      //     console.log(e)
      //   }
      // })
      map.addLayer(overlay);
    
     store.commit('updateOverlayC1',{lat:corner1.lat,lng:corner1.lng})
     store.commit('updateOverlayC2',{lat:corner2.lat,lng:corner2.lng})

    }
  })


  map = L.map('map',{editable:true}).setView([0, 0], 2)

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  continentsLayer = L.layerGroup()

  regionsLayer = L.layerGroup()
  regionsLayer.addTo(map)

  citiesLayer = L.layerGroup()

  riversLayer = L.layerGroup()

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

  map.pm.setGlobalOptions({layerGroup : drawnItems})
  map.pm.addControls({  
    position: 'topright',
    drawMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircleMarker: false,
    drawText: false,
    drawCircle: false,
    dragMode: false,
    cutPolygon: false,
    rotateMode: false,  
    // removalMode: false,
  });

  // map.addControl(new L.Control.Draw({
  //   position: 'topright',
  //   edit: {
  //     featureGroup: drawnItems,
  //     poly: {
  //       allowIntersection: false
  //     }
  //   },
  //   draw: {
  //     marker: false,
  //     polyline: false,
  //     polygon: {
  //       allowIntersection: true
  //     },
  //     rectangle: false,
  //     circlemarker: false,
  //     circle: false
  //   }
  // }))

  map.on('zoomend', function (e) {
    console.log(e)
  })

  drawnItems.on('pm:update', convertToMultiPolygons)

  map.on('pm:remove', convertToMultiPolygons)

  map.on('pm:create', function (e) {
    console.log('pm:create')

    console.log(e)

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
    console.log('convert to polygons')

    drawnItems.clearLayers();
    const region = store.getters.region

    if (region.geometry == null) return

    if (region.geometry.type == 'Polygon') {
      console.log('add polygon',drawnItems.addData(region))
    } else if (region.geometry.type == 'MultiPolygon') {

      region.geometry.coordinates.forEach((coords) => {

        const l = drawnItems.addData({
          type : 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: coords
          }
        })

        console.log('add polygon',l)

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

  map.on('pm:drawstart', convertToPolygons)
  // map.on(L.Draw.Event.DELETESTART, convertToPolygons)

  // MultiPolygon editing doesn't work
  // so convert to polygons and back on stop
  
  map.on('pm:drawend', convertToMultiPolygons)
  // map.on(L.Draw.Event.DELETESTOP, convertToMultiPolygons)

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
    store.commit('updateLabel',{lat:label.getLatLng().lat,lng:label.getLatLng().lng})
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

function modifyRegionLabel(store) {
  const region = store.getters.region
  // const name = region.properties.name
  const lat = region.properties.label.lat
  const lng = region.properties.label.lng
  const ll = label.getLatLng()
  if (lat==ll.lat || lng==ll.lng) return
  label.setLatLng([lat,lng])  
}

function modifyRegionGeometry (store) {
  drawnItems.clearLayers();
  const region = store.getters.region

  if (region.type != 'Feature') {
    console.error('only geojson features supported')
    return
  }

  console.log('modify region geometry')

  function convertToPolygons() {
    console.log('convert to polygons')

    drawnItems.clearLayers();
    const region = store.getters.region

    if (region.geometry == null) return

    if (region.geometry.type == 'Polygon') {
      console.log('add polygon',drawnItems.addData(region))
    } else if (region.geometry.type == 'MultiPolygon') {

      region.geometry.coordinates.forEach((coords) => {

        const l = drawnItems.addData({
          type : 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: coords
          }
        })

        console.log('add polygon',l)

      })
    } else {
      console.error('only polygon and multipolygon supported')
      return
    }
  }
  convertToPolygons()
  // drawnItems.addData(region)
}

// function loadOverlay() {
//   console.log("loadOverlay")
// }

function modifyRegionOverlay() {
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




////////////////////////////////////////////////////////////////////////////
export default {
  name: 'LeafletMap',
  data() {
    return {
      // index: -1550,
      cities: false,
      continents: false,
      rivers: false,
    }
  },
  mounted () {
    createMap(this)
    // console.log(this.$store.state.regions)
    // console.log(this.$store.state.cities)
    // console.log(this.$store.state.rivers)
    // this.fetchRegions()
    // this.fetchCities()
    
  },
  computed: {
    index: {
      get() {
        return this.$store.state.displayYear
      },
      set(v) {
        this.$store.state.displayYear = v
      }
    },
    year: {
      get() {
        return this.index<0 ? this.index*1 : this.index*1+1
      }
    },
    yearText: {
      get() {
        return (this.year<0 ? this.year*-1 + 'BC' : (this.year*1) + 'AD')
      }
    },
    name: {
      get () {
        return this.$store.state.region.properties.name
      }
    },
    labelLat: {
      get () {
        return this.$store.state.region.properties.label.lat
      }
    },
    labelLng: {
      get () {
        return this.$store.state.region.properties.label.lng
      }
    },
    overlayC1Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lat
      }
    },
    overlayC1Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c1.lng
      }
    },
    overlayC2Lat: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lat
      }
    },
    overlayC2Lng: {
      get () {
        return this.$store.state.region.properties.overlay.c2.lng
      }
    },
    geometry: {
      get () {
        console.log('geometry updated')
        return this.$store.state.region.geometry
      }
    }
  },
  watch: {
    '$store.state.region': {
      deep: false,
      handler: function() {
        console.log('update region')
        this.updateVisibility()
      }
    },
    // '$store.state.citiesSize': {
    //   deep: true,
    //   handler: function() {
    //     const store = this.$store
    //     const data = store.state.cities

    //     for (const name of Object.keys(data)) {
    //       if (!cityLayers[name]) {
    //         const city = data[name]
    //         const marker = L.marker(city.geojson.geometry.coordinates, {icon: cityIcon})
    //         marker._city = city
    //         marker.on('click',function() {
    //           store.commit('setCity',city)
    //         });

    //         marker.bindPopup(city.name);
    //         marker.on('mouseover', function () {
    //             this.openPopup();
    //         });
    //         marker.on('mouseout', function () {
    //             this.closePopup();
    //         });
    //         cityLayers[name] = marker
    //       }
    //     }

    //     this.updateVisibility()
    //   }
    // },
    // '$store.state.riversSize': {
    //   deep: true,
    //   handler: function() {
    //     const store = this.$store
    //     const data = store.state.rivers

    //     for (const name of Object.keys(data)) {
    //       if (!riverLayers[name]) {
    //         const river = data[name]
    //         const layer = L.geoJSON(river.geojson)
    //         layer.setStyle({weight: 2})
    //         layer._river = river
    //         layer.on('click',function() {
    //           store.commit('setRiver',river)
    //         });
    //         layer.bindPopup(name);
    //         layer.on('mouseover', function () {
    //             this.openPopup();
    //         });
    //         layer.on('mouseout', function () {
    //             this.closePopup();
    //         });

    //         riverLayers[name] = layer
    //       }
    //     }

    //     this.updateVisibility()
    //   }
    // },
    year(y) {
      this.updateVisibility()
      this.$store.dispatch('xloadOverlay','/years/' + y + '.png')

      if (y < -2070) {
        console.log(y,'<-2070')
        this.$store.commit('xupdateOverlayC1',{
          lat: -1.4061088354351594,
          lng: 103.88713137376364
        })
        this.$store.commit('xupdateOverlayC2',{
          lat: 55.57834467218206,
          lng: -15.292831208745458
        })
      } else if (y < -225) {
        console.log(y,'< -225')
        this.$store.commit('xupdateOverlayC1',{
          lat: -17.476432197195518,
          lng: 141.4990437358201
        })
        this.$store.commit('xupdateOverlayC2',{
          lat: 64.0914075226231,
          lng: -12.656121191677354
        })
      } else if (y < 1350) {
        console.log(y,'< 0')
        this.$store.commit('xupdateOverlayC1',{
          lat: -19.31114335506464,
          lng: 139.21819983498187
        })
        this.$store.commit('xupdateOverlayC2',{
          lat: 67.33986082559097,
          lng: -33.75550165018157
        })
      } else {
        console.log(y)
        this.$store.commit('xupdateOverlayC1',{
          lat: -63.074865690586634,
          lng: 182.8204861160042
        })
        this.$store.commit('xupdateOverlayC2',{
          lat: 73.62778879339942,
          lng: -138.88644434423574
        })
      }

    },
    cities(c) {
      if (c) {
        citiesLayer.addTo(map)
      } else {
        citiesLayer.removeFrom(map)
      }
    },
    rivers(r) {
      if (r) {
        map.addLayer(riversLayer)
      } else {
        map.removeLayer(riversLayer)
      }
    },
    continents(c) {
      if (c) {
        map.addLayer(continentsLayer)
      } else {
        map.removeLayer(continentsLayer)
      }
    },
    name () {
      modifyRegionLabel(this.$store)
    },
    labelLat () {
      modifyRegionLabel(this.$store)
    },
    labelLng () {
      modifyRegionLabel(this.$store)
    },
    overlayC1Lat () {
      modifyRegionOverlay()
    },
    overlayC1Lng () {
      modifyRegionOverlay()
    },
    overlayC2Lat () {
      modifyRegionOverlay()
    },
    overlayC2Lng () {
      modifyRegionOverlay()
    },
    geometry () {
      modifyRegionGeometry(this.$store)
    }
  },
  methods: {
    // back10() {

    // },
    // forward10() {

    // }
    // fetchRegions() {
    //   fetch('http://localhost:3000/regions')
    //     .then((response) => response.json())
    //     .then((data) => {

    //         for (const region of Object.values(data)) {

    //           for (const feature of Object.values(region.years)) {


    //             const layer = L.geoJSON(feature, {
    //               // style: function () {
    //               //   return {
    //               //     color: region.color
    //               //   }
    //               // }
    //             })
    //             .bindTooltip(feature.properties.name, {
    //               // permanent: true, 
    //               direction: 'right'
    //             })
    //             layer.addTo(map)
    //             empires.push({color: region.color, year: feature.properties.year, layer: layer})

    //           }
    //         }

    //         this.updateVisibility()

    //         // const nameList = document.getElementById('nameList')
    //         // data.regions.forEach(el => {
    //         //   const option = document.createElement("option");
    //         //   option.value = el
    //         //   nameList.appendChild(option);
    //         // });
    //       });
    // },
    updateVisibility() {

      regionsLayer.eachLayer((layer) => {
          if (this.year < layer._from || this.year > layer._to) {
            regionsLayer.removeLayer(layer)
          }
      })

      for ( const name in regionLayers) {
        for (const year in regionLayers[name]) {
          const layer = regionLayers[name][year]
          if (this.year >= layer._from && this.year <= layer._to) {
            regionsLayer.addLayer(layer)
          }          
        }
      }

      // const rs = this.$store.state.regions
      // for (const name of Object.keys(rs)) {
      //   const region = rs[name]
      //   for (const year of Object.keys(region)) {
      //     const color = region[year].color
      //     const layer = region[year].layer
      //     const from = region[year].geojson.properties.year.from
      //     const to = region[year].geojson.properties.year.to

      //     layer.setStyle({
      //       color:  (this.year >= from && this.year <= to) ? color : 'rgba(0,0,0,0.0)'
      //     })
      //   }
      // }

      // cities.eachLayer((city) => {
      //   city._icon.style.display = ((this.year >= city.meta.year.from && this.year <= city.meta.year.to) ? '' : 'none' )
      //   city._shadow.style.display = ((this.year >= city.meta.year.from && this.year <= city.meta.year.to) ? '' : 'none' )
      // })

    },
    // fetchCities() {
      // fetch('http://localhost:3000/cities')
      //   .then((response) => response.json())
      //   .then((data) => {

      //     for (var c in data) {
      //         const l = new L.Marker(data[c].geometry.coordinates)
      //         l.on('click', (ev) => {
      //           console.log(this,ev);
      //         })
      //         l.bindTooltip(data[c].properties.name, {
      //               // permanent: true, 
      //               direction: 'right'
      //           }).on('click',() => {
      //             console.log(data[c])
      //           })
      //         l.meta = {
      //           city: data[c],
      //           year: {
      //             from: (data[c].properties.founded ? data[c].properties.founded : 2020),
      //             to: (data[c].properties.abandoned ? data[c].properties.abandoned : 3000)
      //           }
      //         };
      //         l.addTo(cities)
      //     }

      //     cities.addTo(map)
      //     this.updateVisibility()
      // })
    // }

  }
}
</script>

<style>

.geo {
  position: relative;
  width: 100%;
  height: 100%;
}

#map {
  position: absolute;
  height: 100%;
  width: 100%;
}

img.huechange { filter: hue-rotate(120deg); }
img.huechange2 { filter: hue-rotate(240deg); }

#slider {
  position: absolute;
  bottom: 20px;
  left: 50px;
  width: calc(100% - 100px);
  z-index: 1000;
}

#slider #yearText {
  font-size: xx-large;
}

#slider input[type=range] {
  width: 100%;
}

</style>
