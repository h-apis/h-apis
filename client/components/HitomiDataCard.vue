<template>
  <v-card
      elevation="2"
      outlined
      shaped
      class="mx-auto"
  >
    <div class="d-flex flex-no-wrap">
      <v-avatar
          class="ma-3"
          size="150"
          tile
      >
        <v-img :src="`/${data.id}/thumbnail`"></v-img>
      </v-avatar>
      <div>
        <v-card-title>
          {{data.title}}
        </v-card-title>
        <v-card-subtitle>
          {{data.id}}
          {{data.language}}
        </v-card-subtitle>
        <v-card-text>
          <v-chip-group
              :column="true"
              max="0"
          >
            <v-chip
                v-for="tag in data.tags"
                :key="`${tag.name}_${tag.type}`"
                :color="tagChipColor(tag)"
                outlined
                small
            >
              {{textizeTag(tag)}}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'HitomiDataCard',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    textizeTag(tagData) {
      const {type, name} = tagData;
      return `${name} ${type === 'female' ? '♀' : type === 'male' ? '♂' : ''}`
    },
    tagChipColor(tagData) {
      const {type} = tagData;
      return type === 'female' ? 'orange' : type === 'male' ? 'blue' : '';
    }
  }
}
</script>
