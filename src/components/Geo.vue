<template>
  <div class="geo">
    <div id="map" />
    <div id="slider">
      <div id="yearText" v-text="yearText"></div>
      <div><input type="range" min="-3500" max="2020" step="1" v-model="index" /></div>
      <div><label for="showCities">Show Cities: </label><input type="checkbox" id="showCities" v-model="cities" /></div>
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

//import 'leaflet-distortableimage'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

let map = null
let regionsLayer = null
let regionLayers = {}

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

function createMap (store) {

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
      store.commit('updateOverlayC1',corner1.lat,corner1.lng)
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

      store.commit('updateOverlayC2',corner2.lat,corner2.lng)
  
     })
     m2.addTo(map);
     m2._icon.classList.add("huechange2")

      map.fitBounds(bounds);
      overlay = new L.ImageOverlay(imageUrl, bounds, {
          opacity: 0.7,
          interactive: true
      });
      map.addLayer(overlay);
    
     store.commit('updateOverlayC1',corner1.lat,corner1.lng)
     store.commit('updateOverlayC2',corner2.lat,corner2.lng)

    }
  })


  map = L.map('map',{editable:true}).setView([0, 0], 2)

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  regionsLayer = L.layerGroup()
  regionsLayer.addTo(map)

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
    removalMode: false,
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
    drawnItems.clearLayers();
    const region = store.getters.region

    if (region.geometry == null) return

    if (region.geometry.type == 'Polygon') {
      console.log(drawnItems.addData(region))
    } else if (region.geometry.type == 'MultiPolygon') {

      region.geometry.coordinates.forEach((coords) => {
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

  drawnItems.addData(region)
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
      index: 0,
      cities: 0
    }
  },
  mounted () {
    createMap(this.$store)
    // console.log(this.$store.state.regions)
    // console.log(this.$store.state.cities)
    // console.log(this.$store.state.rivers)
    // this.fetchRegions()
    // this.fetchCities()
    
  },
  computed: {
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
        return this.$store.state.region.geometry
      }
    }
  },
  watch: {
    '$store.state.region': {
      deep: false,
      handler: function() {
        this.updateVisibility()
      }
    },
    // '$store.state.regions': {
    '$store.state.regionsSize': {
      deep: false,
      handler: function() {
        // regions updated
console.log('regions updated')
        // TODO: only adds, should also remove
        const store = this.$store
        const data = store.state.regions

        for (const name of Object.keys(data)) {
          const region = data[name]
          for (const year of Object.keys(region)) {

            const key = `${name}-${year}`
            if (!regionLayers[key]) {
              const layer = L.geoJSON(region[year])
              layer.pm.setOptions({ allowEditing: false })
              layer._name = name
              layer._from = region[year].properties.year.from
              layer._to = region[year].properties.year.to
              layer.on('click',function(ev) {
                if (ev.originalEvent.shiftKey) {
                  const geom1 = store.state.region.geometry
                  const geom2 = region[year].geometry
                  if (geom1==null) {
                    store.commit('updateGeometry',geom2)
                  } else {
                    var u = union(geom1, geom2);
                    store.commit('updateGeometry',u.geometry)
                  }
                } else {
                  try {
                  store.commit('setRegion',{name,year})
                  } catch (e) {
                    console.log(e)
                  }
                }
              });
              regionLayers[key] = layer
            }
          }
        }

        this.updateVisibility()

            // const nameList = document.getElementById('nameList')
            // data.regions.forEach(el => {
            //   const option = document.createElement("option");
            //   option.value = el
            //   nameList.appendChild(option);
            // });
      }
    },
    '$store.state.cities': {
      deep: true,
      handler: function() {

        // const store = this.$store

        // for (const name of Object.keys(data)) {

          // const city = data[name]
          // console.log(city)
          // for (const year of Object.keys(region)) {

          //   const key = `${name}-${year}`
          //   if (!regionLayers[key]) {
          //     const layer = L.geoJSON(region[year].geojson)
          //     layer._region = region[year]
          //     layer.on('click',function() {
          //       store.commit('setRegion',region[year].geojson)
          //     });
          //     regionLayers[key] = layer
          //   }
          // }
        // }

        this.updateVisibility()
      }
    },
    '$store.state.rivers': {
      deep: true,
      handler: function() {
        console.log(this.$store.state.rivers)
        // const store = this.$store
        // for (const name of Object.keys(data)) {
        //   const region = data[name]
        //   for (const year of Object.keys(region)) {

        //     const key = `${name}-${year}`
        //     if (!regionLayers[key]) {
        //       const layer = L.geoJSON(region[year].geojson)
        //       layer._region = region[year]
        //       layer.on('click',function() {
        //         store.commit('setRegion',region[year].geojson)
        //       });
        //       regionLayers[key] = layer
        //     }
        //   }
        // }

        // this.updateVisibility()
      }
    },
    year() {
      this.updateVisibility()
    },
    cities() {
      console.log('cities')
      this.updateVisibility()
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

      const regionKey = `${this.$store.getters.region.properties.name}-${this.$store.getters.region.properties.year.from}`

      regionsLayer.eachLayer((layer) => {

          const name = layer._name
          const from = layer._from
          const to = layer._to
          const key = `${name}-${from}`

          if (key == regionKey || this.year < from || this.year > to) {
            regionsLayer.removeLayer(layer)
          }
      })

      for ( const k in regionLayers) {
        const layer = regionLayers[k]
        const name = layer._name
        const from = layer._from
        const to = layer._to
        const key = `${name}-${from}`

        if (key != regionKey && this.year >= from && this.year <= to) {
          regionsLayer.addLayer(layer)

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
    width: 100%;
    height: 100%;
  }

  #map {
    height: 100%;
    width: 100%;
  }

  img.huechange { filter: hue-rotate(120deg); }
  img.huechange2 { filter: hue-rotate(240deg); }

  #slider {
  position: absolute;
  bottom: 20px;
  left: 50px;
  width: calc(70vw - 100px);
  z-index: 1000;
}

#slider #yearText {
  font-size: xx-large;
}

#slider input[type=range] {
  width: 100%;
}

</style>
