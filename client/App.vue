<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
    >
      작업예정
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <SearchLayout/>
        <v-layout class="mt-4">
          <v-row>
            <v-col
                v-for="item in dataList"
                :key="item.id"
                :cols="12"
            >
              <HitomiDataCard :data="item"/>
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import HitomiDataCard from './components/HitomiDataCard';
import SearchLayout from './layouts/SearchLayout';

export default {
  components: { SearchLayout, HitomiDataCard },
  data: () => ({
    drawer: null,
    dataList: []
  }),
  methods: {
    refreshDownloadedDataList: async function () {
      try {
        const { data } = await axios.get('/get');
        this.dataList = data;
      } catch (e) {
        alert('fetch failed');
      }
    }
  },
  created() {
    this.refreshDownloadedDataList();
  }
}
</script>
