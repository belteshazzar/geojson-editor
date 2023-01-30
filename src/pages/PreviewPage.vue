<template>
  <div id="preview-page">
    <div id="preview-map" />
    <div id="slider">
      <div v-text="yearText"></div>
      <div><input type="range" min="-4000" max="1999" step="1" v-model="index" /></div>
    </div>
  </div>
</template>
  
<script>

import L from 'leaflet'

let layers = []

function updateVisibility(year) {
  layers.forEach((layer) => {
    layer.layer.setStyle({
      color: year < layer.year ? 'rgba(0,0,0,0)' : 'rgba(0,0,1,1.0)'
    })
  })
}


export default {
    name: 'PreviewPage',
    data() {
      return {
        index: 0,
      }
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
      }
    },
    watch: {
      year(y) {
        updateVisibility(y)
      }
    },
    mounted() {
        let map = L.map('preview-map',{editable:true}).setView([0, 0], 2)

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map)

        fetch('http://localhost:3000/regions')
          .then((response) => response.json())
          .then((data) => {

            for (const years of Object.values(data)) {

              for (const feature of Object.values(years)) {


                const layer = L.geoJSON(feature, {
                  style: function () {
                    return {
                      color: '#666C79'
                    }
                  }
                })
                layer.addTo(map)
                layers.push({year: feature.properties.year, layer: layer})

              }
            }

            updateVisibility(this.year)

            // const nameList = document.getElementById('nameList')
            // data.regions.forEach(el => {
            //   const option = document.createElement("option");
            //   option.value = el
            //   nameList.appendChild(option);
            // });
          });

    }
}


</script>
  
<style>

#preview-map {
  width: 100%;
  height: 100vh;
}

#slider {
  position: absolute;
  bottom: 20px;
  left: 50px;
  width: calc(100vw - 100px);
  z-index: 1000;
}

#slider div {
  font-size: xx-large;
}

</style>
  