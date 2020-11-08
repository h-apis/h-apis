<template>
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
</template>

<script>
import HitomiDataCard from '../components/HitomiDataCard';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DataListLayout',
  components: { HitomiDataCard },
  computed: {
    ...mapGetters({
      dataList: 'browse/dataList'
    })
  },
  methods: {
    ...mapActions({
      initDataList: 'browse/initDataList'
    })
  },
  created() {
    this.initDataList();
  }
}
</script>
