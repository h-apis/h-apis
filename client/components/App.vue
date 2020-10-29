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
        <v-layout>
          <v-row dense>
            <v-col
                v-for="item in downloadedList"
                :key="item.galleryNumber"
                :cols="12"
            >
              <v-card
                  elevation="2"
                  outlined
                  shaped
                  class="mx-auto"
              >
                <v-card-title>
                  {{item.rawTitle}}
                </v-card-title>
                <v-card-subtitle>
                  {{item.galleryNumber}}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>

        </v-layout>
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
    galleryNumberValue: 644511,
    downloadedList: [],
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
        // noinspection ES6MissingAwait
        this.refreshDownloadedDataList();
      }
    },
    refreshDownloadedDataList: async function() {
      try {
        const { data } = await axios.get('/get');
        this.downloadedList = data;
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
