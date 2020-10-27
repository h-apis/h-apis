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
        <v-layout
            style="width: 20%"
        >
          <v-text-field
              v-model="galleryNumberValue"
              color="success"
              label="갤번입력"
              :loading="isDownloading"
              :disabled="isDownloading"
          />
        </v-layout>

        <v-btn elevation="2" @click="handleSubmit" :disabled="isDownloading">다운로드</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    drawer: null,
    isDownloading: false,
    galleryNumberValue: 644511
  }),
  methods: {
    handleSubmit: async function() {
      try {
        this.isDownloading = true;
        await axios.get(`/download?id=${this.galleryNumberValue}`);
        alert('downloaded');
      } catch (e) {
        console.error(e);
        alert('download failed');
      } finally {
        this.isDownloading = false;
      }
    }
  }
}
</script>
