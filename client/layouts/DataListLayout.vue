<template>
  <v-container class="mt-4">
    <v-row
        justify="center"
        justify-md="start"
    >
      <v-pagination
          v-if="dataList.length"
          :value="initialPageIndex"
          :length="6"
          :disabled="isLoading"
          @input="paginationChangedHandler"
      />
    </v-row>
    <v-row>
      <v-col
          v-for="item in dataList"
          :key="item.id"
          :cols="12"
      >
        <HitomiDataCard :data="item"/>
      </v-col>
    </v-row>
    <InfiniteLoading
        :identifier="infiniteIdentifierId"
        @infinite="infiniteHandler"
    />
  </v-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import HitomiDataCard from '../components/HitomiDataCard';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DataListLayout',
  components: { HitomiDataCard, InfiniteLoading },
  data: () => ({
    infiniteIdentifierId: +new Date()
  }),
  computed: {
    ...mapGetters({
      isLoading: 'browse/isLoading',
      initialPageIndex: 'browse/initialPage',
      dataList: 'browse/dataList'
    })
  },
  methods: {
    ...mapActions({
      setPage: 'browse/setPage',
      fetchNextPage: 'browse/fetchNextPage'
    }),
    async infiniteHandler($state) {
      try {
        await this.fetchNextPage();
        $state.loaded();
      } catch (e) {
        console.error(e);
        $state.error();
      }
    },
    paginationChangedHandler(value) {
      this.setPage(value || 1);
    }
  }
}
</script>
