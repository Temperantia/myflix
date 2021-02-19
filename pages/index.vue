<template lang="pug">
div
  trending-week
  premieres
  v-container.px-10(fluid)
    v-row
      popular-top
      home-reviews
    v-row
      v-col
        home-genres
    home-suggestions
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class Index extends Vue {
  head() {
    return {
      script: [
        {
          type: 'application/ld+json',
          innerHTML:
            '{"@context": "https://schema.org","@type": "WebSite","url": "https://www.my-flix.net/","potentialAction": {"@type": "SearchAction","target": "https://my-flix.net/search?search={search_term_string}","query-input": "required name=search_term_string"}}',
        },
      ],
    };
  }
}
</script>
