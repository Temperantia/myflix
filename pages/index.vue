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
<script lang='ts'>
/*
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class Home extends Vue {
     isFavorite(id) {
    if (!id) {
      return false;
    }
    const title = this.$search.find((title) => Number(title.id) === Number(id));
    return (
      !!this.favorites &&
      !!this.favorites[title.u ? 'shows' : 'films'] &&
      !!this.favorites[title.u ? 'shows' : 'films'][id]
    );
  }
  addFavorite(title) {
    this.$addFavorite(
      {
        id: title.id,
        tallBoxArt: title.i,
        title: title.t,
        releaseYear: title.y,
        maturity: this.$maturitiesEurope[title.v],
        seasonCount: title.s,
        genres: title.g,
      },
      title.u ? 'shows' : 'films'
    );
  }
  addFavoriteFromId(id) {
    const title = this.$search.find((title) => Number(title.id) === Number(id));
    this.$addFavorite(
      {
        id: title.id,
        tallBoxArt: title.i,
        title: title.t,
        releaseYear: title.y,
        maturity: this.$maturitiesEurope[title.v],
        seasonCount: title.s,
        genres: title.g,
      },
      title.u ? 'shows' : 'films'
    );
  }
  removeFavorite(title) {
    this.$removeFavorite({ id: title.id }, title.u ? 'shows' : 'films');
  }
  removeFavoriteFromId(id) {
    const title = this.$search.find((title) => Number(title.id) === Number(id));
    this.$removeFavorite({ id: title.id }, title.u ? 'shows' : 'films');
  }
}
 */
</script>
