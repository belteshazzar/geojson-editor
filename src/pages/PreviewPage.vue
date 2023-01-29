<template>
  <div id="preview-map" />
</template>
  
<script>

import L from 'leaflet'

export default {
    name: 'PreviewPage',
    mounted() {
        let map = L.map('preview-map',{editable:true}).setView([0, 0], 2)
        console.log(map)

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

                L.geoJSON(feature, {
                  style: function () {
                    return {
                      color: '#666C79'
                    }
                  }
                }).addTo(map)

              }
            }

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

</style>
  