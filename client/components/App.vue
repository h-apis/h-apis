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

        <v-layout class="mt-4">
          <v-row dense>
            <v-col
                v-for="item in downloadedList"
                :key="item.id"
                :cols="12"
            >
              <HitomiDataCard :data="item" />
            </v-col>
          </v-row>

        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import HitomiDataCard from './HitomiDataCard';

export default {
  components: { HitomiDataCard },
  data: () => ({
    drawer: null,
    isDownloading: false,
    galleryNumberValue: 644511,
    downloadedList: []
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
    },
    textizeTag(tagData) {
      const {type, name} = tagData;
      return `${name} ${type === 'female' ? '♀' : type === 'male' ? '♂' : ''}`
    },
    tagChipColor(tagData) {
      const {type} = tagData;
      return type === 'female' ? 'orange' : type === 'male' ? 'blue' : '';
    }
  },
  created() {
    this.refreshDownloadedDataList();
  }
}
</script>
