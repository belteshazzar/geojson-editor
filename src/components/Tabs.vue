<template>
  <div>
      <div class="tabs">
          <ul>
              <li 
                v-for="tab in tabs" 
                :class="{ 'is-active': tab.isActive }" 
                :key="tab"
                @click="selectTab(tab)">
                  {{ tab.name }}
              </li>
          </ul>
      </div>

      <div class="tabs-details">
          <slot></slot>
      </div>
  </div>
</template>

<script>
  export default {
    // eslint-disable-next-line
      name: "Tabs",
      data() {
          return {tabs: [] };
      },
      created() {
      },
      mounted() {
        this.selectTab(this.tabs[0])
      },
      methods: {
          selectTab(selectedTab) {
              this.tabs.forEach(tab => {
                  tab.isActive = (tab.name == selectedTab.name);
              });
          }
      }
  }
</script>

<style>

  div.tabs > ul {
    display: block;
    list-style: none;
    margin: 0 0 0 20px;
    padding: 0;
  }

  div.tabs > ul > li {
    padding: 5px 5px;
    border-radius: 10px 10px 0 0;
    margin: 0;
    display: inline-block;
    margin-right: 5px;
    cursor: pointer;
    background-color: #ddd;
    color: #aaa;
  }

  div.tabs > ul > li.is-active {
    background-color: #fff;
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    color: #000;
  }

  .tab {
    display: inline-block;
    color: black;
    padding: 20px;
    min-width: 800px;
    border-radius: 10px;
    min-height: 400px;
    background-color: #fff;
  }

</style>