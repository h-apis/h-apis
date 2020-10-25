<template>
  <div>
    <div>
      <label for="galleryNumber">갤번입력</label>
      <input id="galleryNumber" v-model="galleryNumberValue" type="number"/>
    </div>
    <div>
      <button id="submit" @click="handleSubmit" :disabled="isDownloading">전송</button>
      <div>{{statusText}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',
  data: () => ({
    galleryNumberValue: 644511,
    isDownloading: false,
    statusText: '',
  }),
  methods: {
    handleSubmit: async function(e) {
      try {
        this.statusText = '다운로드중';
        this.isDownloading = true;
        await axios.get(`/download?id=${this.galleryNumberValue}`);
        alert('downloaded');
      } catch (e) {
        console.error(e);
        alert('download failed');
      } finally {
        this.statusText = '';
        this.isDownloading = false;
      }
    }
  }
}
</script>
