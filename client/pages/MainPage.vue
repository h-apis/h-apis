<template>
  <v-container>
    <SearchLayout/>
    <DataListLayout/>
  </v-container>
</template>

<script>
import SearchLayout from '../layouts/SearchLayout';
import DataListLayout from '../layouts/DataListLayout';

export default {
  name: 'MainPage',
  components: {
    SearchLayout,
    DataListLayout
  }
}
</script>
