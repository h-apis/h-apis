<template>
  <v-container>
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
      </v-col>
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
    <v-row v-if="inquiryData">
      <v-col cols="12">
        조회결과
      </v-col>
      <v-col cols="12">
        <HitomiDataCard :data="inquiryData"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HitomiDataCard from '../components/HitomiDataCard';
import axios from 'axios';

export default {
  name: 'SearchLayout',
  components: { HitomiDataCard },
  data: () => ({
    galleryNumberValue: 644511,
    isLoading: false,
    inquiryData: undefined
  }),
  methods: {
    handleInquiryClicked: async function () {
      try {
        this.isLoading = true;
        const { data } = await axios.get(`/api/inquiry?id=${this.galleryNumberValue}`);

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
        await axios.get(`/api/download?id=${this.galleryNumberValue}`);
        alert('downloaded');
      } catch (e) {
        console.error(e);
        alert('download failed');
      } finally {
        this.isLoading = false;
        //TODO 로컬데이터 신규 fetch -> merge
      }
    }
  }
}
</script>
