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
        <DataListLayout/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SearchLayout from './layouts/SearchLayout';
import DataListLayout from './layouts/DataListLayout';

export default {
  components: { DataListLayout, SearchLayout },
  data: () => ({
    drawer: null,
    dataList: []
  })
}
</script>
