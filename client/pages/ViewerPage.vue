<template>
  <v-container>
    <v-row justify="center">
      <v-btn @click="showBackImage">back</v-btn>
      {{currentIndex}} - {{lastIndex}}
      <v-btn @click="showNextImage">next</v-btn>
    </v-row>
    <v-row justify="center">
      <img
          v-if="Number.isInteger(currentIndex)"
          :src="currentImageSrc"
          :alt="`${galleryNumber}-${currentIndex}`"
          style="max-width: 100%"
      />
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

// TODO image Index = hashbang url 로 처리 = 주소직접 접근이 가능하나 history 에는 남기지 않기 위함
export default {
  name: 'ViewerPage',
  data() {
    return {
      galleryNumber: undefined,
      currentIndex: undefined,
      lastIndex: undefined,
      preloadCount: 5
    }
  },
  computed: {
    currentImageSrc() {
      return `/api/item/${this.galleryNumber}/image/${this.currentIndex}`
    }
  },
  methods: {
    initData(data) {
      this.currentIndex = 0;
      this.lastIndex = data.files.length - 1;
    },
    showBackImage() {
      this.currentIndex--;
    },
    showNextImage() {
      this.currentIndex++;
    }
  },
  created() {
    this.galleryNumber = this.$route.params.id;
    axios.get(`/api/item/${this.galleryNumber}`)
        .then(({ data }) => {
          this.initData(data);
        })
        .catch((e) => {
          console.error(e);
        })
  }
}
</script>
