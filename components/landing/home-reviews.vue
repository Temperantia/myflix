<template lang="pug">
v-col(cols='12', lg='5')
  h1.title-border.font-weight-bold LATEST USER REVIEWS
  v-container(fluid)
    v-row.my-2.userReviews(v-for='review of latestReviews', :key='review.id')
      v-col.mh-Review(cols='12', md='2')
        nuxt-link(:to='review.title.route')
          img(:src='review.title.Poster', :alt='review.title.title')
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
      flixlist-add(v-if='connected', :id='review.title.id')
</template>
<script lang="ts">
import slugify from 'slugify';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const reviewsModule = namespace('reviews');
const localStorageModule = namespace('localStorage');

@Component
export default class HomeReviews extends Vue {
  slugify = slugify;
  @localStorageModule.State('connected') connected!: boolean;
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
