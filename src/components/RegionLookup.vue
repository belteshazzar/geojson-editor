<template>

  <label class="left" for="region-lookup-name">Name: </label>
  <span class="left2">
    <input 
      type="search" 
      list="nameList" 
      v-model="regionLookupName" 
      autocomplete="off" 
      id="name" 
      :class="nameExists ? '' : 'not-exists'" />
  </span>
  <datalist id="nameList">
    <option></option>
    <option v-for="regionName in regionNames" :key="regionName">{{ regionName }}</option>
  </datalist>

  <label class="left" for="region-lookup-year">Year: </label>
  <span class="left2">
    <input type="search" list="yearList" v-model="regionLookupYear" autocomplete="off" id="region-lookup-year" :class="yearExists ? '' : 'not-exists'">
    <button id="prev" name="prev" @click="prev" :disabled="!yearExists">prev</button>
    <button id="next" name="next" @click="next" :disabled="!yearExists">next</button>
  </span>
  <datalist id="yearList">
    <option></option>
    <option v-for="regionYear in regionYears" :key="regionYear">{{ regionYear }}</option>
  </datalist>

</template>

<script>

export default {
  name: 'RegionLookup',
  data() {
    return {
      regionLookupName: "",
      nameExists: false,
      regionLookupYear: "",
      yearExists: false,
    }
  },
  computed: {
    // name: {
    //   get () {
    //     return this.$store.state.region.properties.name
    //   },
    //   set (value) {
    //     this.$store.commit('updateName', value)
    //   }
    // },
    // yearFrom: {
    //   get () {
    //     return this.$store.state.region.properties.year.from
    //   },
    //   set (value) {
    //     this.$store.commit('updateYearFrom', value)
    //   }
    // },
    regionNames: {
      get () {
        return Object.keys(this.$store.state.regions)
      }
    },
    regionYears: {
      get () {
        if (this.regionLookupName=="") return []
        const region = this.$store.state.regions[this.regionLookupName]
        if (!region) return []
        return Object.keys(region)
      }
    }
  },
  watch: {
    '$store.state.region': {
      handler: function() {
        this.regionLookupName = this.$store.state.region.properties.name
        this.regionLookupYear = this.$store.state.region.properties.year.from
        this.nameExists = this.regionLookupName != ''
        this.yearExists = this.regionLookupYear != ''
        console.log('region updated',this.regionLookupName,this.regionLookupYear,this.nameExists,this.yearExists)
      }
    },
    regionLookupName() {
      console.log('region lookup name')
      if (this.regionLookupName == "") {
        this.regionLookupYear = ""
        if (this.nameExists) {
          console.log('lookup name reset 1')
          this.$store.commit('resetRegion')
          this.nameExists = false
          this.yearExists = false
        }
      } else {
        const region = this.$store.state.regions[this.regionLookupName.toLowerCase()]
        console.log(this.regionLookupName,region)
        if (region) {
          this.nameExists = true
          this.yearExists = true
          this.regionLookupYear = Object.keys(region)[0]
          this.$store.commit('setRegion',{name: this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
        } else {
          if (this.nameExists) {
            console.log('lookup name reset 2')
            this.$store.commit('resetRegion')
            this.nameExists = false
            this.yearExists = false
          }
        }
      }
    },
    regionLookupYear() {
      console.log('region lookup year')
      if (this.nameExists) {
        const region = this.$store.state.regions[this.regionLookupName.toLowerCase()]
        if (region) {
          const year = region[this.regionLookupYear]
          if (year) {
            this.yearExists = true
            this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
          } else {
            this.yearExists = false
            console.log('lookup year reset 1')
            this.$store.commit('resetRegion')
          }
        } else {
          this.yearExists = false
          console.log('lookup year reset 2')
          this.$store.commit('resetRegion')
        }
      }
      // console.log(this.regionLookupName,this.regionLookupYear)
    }
  },
  methods: {
    prev() {
      if (!this.nameExists || !this.yearExists) return
      const years = Object.keys(this.$store.state.regions[this.regionLookupName])
      const curr = years.indexOf(this.regionLookupYear)

      if (curr > 0) {
        this.regionLookupYear = years[curr-1]
      }
    },
    next() {
      if (!this.nameExists || !this.yearExists) return
      const years = Object.keys(this.$store.state.regions[this.regionLookupName])
      const curr = years.indexOf(this.regionLookupYear)

      if (curr + 1 < years.length) {
        this.regionLookupYear = years[curr+1]
      }
    }
  }
}

</script>

<style scoped>

/* ------------------ reset -------------- */

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

:root {
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  position: relative;
  font-family: system-ui, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  min-height: 100%;
}
body {
  position: relative;
  min-height: 100vh;
  font-size: 100%;
  line-height: 1.5;
}

input,
textarea,
button {
  font-size: inherit;
  font-family: inherit;
}

/* ------------------ /reset -------------- */


.left {
    float: left;
}

.left2 {
    overflow: hidden;
    display: block;
    padding: 0 4px 0 10px
}
.left2 input {
    width: calc(100% - 10px);
}

input {
  border: 1px solid #ddd;
  margin: 2px;
  padding: 2px;
}

button {
  margin: 2px;
  padding: 2px;
  border: 0;
 background: none;
 box-shadow: none;
 border-radius: 0px;
 background-color: #ddd;
}

#region-lookup-year {
  width: 100px;
}

.not-exists {
  border: 1px solid orange;
}

</style>
