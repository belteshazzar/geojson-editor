<template>
  <table class="region-lookup">
    <tr>
      <td colspan="2">Region Lookup</td>
    </tr>
    <tr>
      <td><label for="region-lookup-name">Name: </label></td>
      <td>
        <input 
          type="search" 
          list="nameList" 
          v-model="regionLookupName" 
          autocomplete="off" 
          id="name" 
          :class="nameExists ? '' : 'not-exists'" />
        <datalist id="nameList">
          <option></option>
          <option v-for="regionName in regionNames" :key="regionName">{{ regionName }}</option>
        </datalist>
      </td>
    </tr>
    <tr>
      <td><label for="region-lookup-year">Year: </label></td>
      <td>
        <button id="prev" name="prev" @click="prev" :disabled="!prevYearExists">prev</button>
        <input type="search" list="yearList" v-model="regionLookupYear" autocomplete="off" id="region-lookup-year" :class="yearExists ? '' : 'not-exists'">
        <button id="load" name="load" @click="load" :disabled="!yearExists">load</button>
        <button id="next" name="next" @click="next" :disabled="!nextYearExists">next</button>
        <datalist id="yearList">
          <option></option>
          <option v-for="regionYear in regionYears" :key="regionYear">{{ regionYear }}</option>
        </datalist>
      </td>
    </tr>
  </table>
</template>

<script>

export default {
  name: 'RegionLookup',
  data() {
    return {
      regionLookupName: "",
      regionLookupYear: ""
    }
  },
  computed: {
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
    },
    nameExists: {
      get() {
        return this.$store.state.regions[this.regionLookupName.toLowerCase()]
      }
    },
    yearExists: {
      get() {
        return this.nameExists && this.$store.state.regions[this.regionLookupName.toLowerCase()][this.regionLookupYear];
      }
    },
    prevYearExists: {
      get() {
        if (!this.nameExists || !this.yearExists) return false
        const years = Object.keys(this.$store.state.regions[this.regionLookupName.toLowerCase()])
        const curr = years.indexOf(this.regionLookupYear.toLowerCase())
        return (curr + 1 < years.length)
      }
    },
    nextYearExists: {
      get() {
        if (!this.nameExists || !this.yearExists) return false
        const years = Object.keys(this.$store.state.regions[this.regionLookupName.toLowerCase()])
        const curr = years.indexOf(this.regionLookupYear.toLowerCase())
        return (curr > 0)
      }
    }
  },
  methods: {
    prev() {
      const years = Object.keys(this.$store.state.regions[this.regionLookupName.toLowerCase()])
      const curr = years.indexOf(this.regionLookupYear.toLowerCase())

      this.regionLookupYear = years[curr+1]
      this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
    },
    load() {
      this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
    },
    next() {
      const years = Object.keys(this.$store.state.regions[this.regionLookupName.toLowerCase()])
      const curr = years.indexOf(this.regionLookupYear.toLowerCase())

      this.regionLookupYear = years[curr-1]
      this.$store.commit('setRegion',{name:this.regionLookupName.toLowerCase(),year:this.regionLookupYear})
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

.region-lookup {
  width: 100%;
  background-color: lightgoldenrodyellow;
  padding: 5px;
}

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
