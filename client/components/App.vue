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
        <v-layout>
          <v-row>
            <v-col
                sm="4"
                md="4"
            >
              <v-text-field
                  v-model="galleryNumberValue"
                  color="success"
                  label="갤번입력"
                  :loading="isLoading"
                  :disabled="isLoading"
              />
            </v-col >
            <v-col
                sm="6"
                md="4"
            >
              <div>
                <v-btn elevation="2" @click="handleInquiryClicked" :disabled="isLoading">조회</v-btn>
                <v-btn elevation="2" @click="handleDownloadClicked" :disabled="isLoading">다운로드</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-layout>
        <v-layout v-if="inquiryData">
          <v-row>
            <v-col cols="12">
              조회결과
            </v-col>
            <v-col cols="12">
              <HitomiDataCard :data="inquiryData"/>
            </v-col>
          </v-row>
        </v-layout>

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
import HitomiDataCard from './HitomiDataCard';

export default {
  components: { HitomiDataCard },
  data: () => ({
    drawer: null,
    isLoading: false,
    galleryNumberValue: 644511,
    dataList: [],
    inquiryData: undefined
  }),
  methods: {
    handleInquiryClicked: async function () {
      try {
        this.isLoading = true;
        const { data } = await axios.get(`/inquiry?id=${this.galleryNumberValue}`);

        if (!data) {
          alert('없는번호');
          return;
        }

        this.inquiryData = data;
      } catch (e) {
        console.error(e);
        alert('inquiry failed');
      } finally {
        this.isLoading = false;
      }
    },
    handleDownloadClicked: async function () {
      try {
        this.isLoading = true;
        await axios.get(`/download?id=${this.galleryNumberValue}`);
        alert('downloaded');
      } catch (e) {
        console.error(e);
        alert('download failed');
      } finally {
        this.isLoading = false;
        // noinspection ES6MissingAwait
        this.refreshDownloadedDataList();
      }
    },
    refreshDownloadedDataList: async function () {
      try {
        const { data } = await axios.get('/get');
        this.dataList = data;
      } catch (e) {
        alert('fetch failed');
      }
    },
    textizeTag(tagData) {
      const { type, name } = tagData;
      return `${name} ${type === 'female' ? '♀' : type === 'male' ? '♂' : ''}`
    },
    tagChipColor(tagData) {
      const { type } = tagData;
      return type === 'female' ? 'orange' : type === 'male' ? 'blue' : '';
    }
  },
  created() {
    this.refreshDownloadedDataList();
  }
}
</script>
