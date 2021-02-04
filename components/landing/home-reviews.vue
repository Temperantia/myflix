<template lang="pug">
v-col(cols='12', lg='5')
  h1.title-border.font-weight-bold LATEST USER REVIEWS
  v-container(fluid)
    v-row.my-2.userReviews(v-for='review of latestReviews', :key='review.id')
      v-col.mh-Review(cols='12', md='2')
        nuxt-link(:to='review.title.route')
          img(
            :src='review.title.tallBoxArt ? review.title.tallBoxArt : review.title.boxArt'
          )
        //-client-only(v-if='favorites')
          .click(
            v-if='isFavorite(review.title.id)',
            @click='removeFavoriteFromId(review.title.id)'
          )
            v-icon mdi-star
            span In Favorites
          .click(v-else, @click='addFavoriteFromId(review.title.id)')
            v-icon mdi-star-outline
            span Add to Favorites
      v-col.py-0.reviewText(cols='12', md='10')
        v-row.ma-0
          v-col.pl-0(cols='12', lg='6')
            nuxt-link(:to='review.title.route')
              h3 {{ review.title.title }}
          v-col.text-lg-right(cols='12', lg='6')
            div Overall Rating: {{ review.ratings.Overall }}
        p
          span(v-html='content(review.content)')
          span.red-netflix--text.click.ml-1(
            @click='$router.push((review.title.type === "show" ? "tvshows/" : "films/") + slugify(review.title.title, { lower: true, strict: true }) + "/reviews#review-" + review.id)'
          ) show more
        .spacer
        .reviewBy
          span Review by
          nuxt-link(:to='"/profile/" + review.author.username')
            span.red-netflix--text.font-weight-bold {{ " " + review.author.username }}
          span {{ " - " + $moment(review.postedOn.seconds * 1000).format("MMM D, yyyy").toUpperCase() }}
        //-client-only(v-if='favorites')
          .click.faveButton(
            v-if='isFavorite(review.title.id)',
            @click='removeFavoriteFromId(review.title.id)'
          )
            v-icon.mr-2 mdi-star
            span.d-none.d-md-inline-flex In Favorites
          .click.faveButton(
            v-else,
            @click='addFavoriteFromId(review.title.id)'
          )
            v-icon.mr-2 mdi-star-outline
            span.d-none.d-md-inline-flex Add to Favorites
</template>
<script lang="ts">
import slugify from 'slugify';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const reviewsModule = namespace('reviews');

@Component
export default class HomeReviews extends Vue {
  slugify = slugify;
  @reviewsModule.State('latest') latestReviews!: any;

  content(content: string) {
    return content.length > 300 ? content.substring(0, 300) + ' ...' : content;
  }
}
</script>
<style lang="scss" scoped>
.reviewBy {
  font-size: 14px;
  position: absolute;
  bottom: 12px;
  left: 12px;
}

.spacer {
  height: 30px;
  width: auto;
  display: block;
}

.reviewText {
  position: relative;
  min-height: 250px;

  .faveButton {
    position: absolute;
    bottom: 12px;
    right: 12px;
    height: 21px;
    width: auto;

    .v-icon {
      font-size: 16px;
    }
    span {
      font-size: 14px;
    }
  }
}

.userReviews {
  border-bottom: 1px $grey-google solid;
}

.mh-Review {
  position: relative;
}
</style>
