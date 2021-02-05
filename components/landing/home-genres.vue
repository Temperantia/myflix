<template lang="pug">
h1.title-border.font-weight-bold SUGGESTED GENRES
  v-container(fluid)
    v-row
      v-col.click(
        cols='12',
        lg='4',
        v-for='category in categories',
        :key='category.category',
        style='position: relative',
        @click='$router.push({ name: "titles", params: { category: category.category } })'
      )
        img(:src='category.image')
        div(
          style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
        )
        div(style='position: absolute; bottom: 30%; left: 0; padding: 30px')
          h1 {{ category.category }}
          div {{ category.value }} Titles
</template>
<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const browseModule = namespace('browse');

@Component
export default class HomeGenres extends Vue {
  @browseModule.State('categories') categories!: any;
}
</script>
