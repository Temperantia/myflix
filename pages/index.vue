<template lang="pug">
div
  trending-week.title-border.pa-0
  premieres
  v-container(fluid)
    v-row
      v-col(cols='7')
        h1.title-border TOP 5 MOST POPULAR ONGOING SERIES
        h2.subtitle.py-5 {{ $dateFns.format(new Date(), "MMM d, yyyy").toUpperCase() }}
        v-row.my-2(v-for='(item, index) in topSeries', :key='item.id')
          v-col.text-center(cols='1')
            h1 {{ index + 1 }}
          v-col(cols='2')
            nuxt-link(:to='item.r')
              img(:src='item.i')
          v-col.py-0(cols='9')
            nuxt-link(:to='item.r')
              h1 {{ item.t }}
            i(v-if='item.s') {{ item.s + " seasons, " + item.e + " episodes" }}
            div
              span {{ "Score " }}
              span.red-netflix--text {{ item.z + "/10" }}
            div(v-if='item.a') Released {{ $dateFns.format(item.a, "MMM d, yyyy") }}
            div {{ item.f }} members watching this
      v-col(cols='5')
        h1.title-border.mb-5 LATEST USER REVIEWS
        v-row.my-2(v-for='(review, index) in reviewsLatest', :key='review.id')
          v-col(cols='3')
            nuxt-link(
              :to='$search.find((item) => Number(item.id) == review.title.id).r'
            )
              img(
                :src='review.title.tallBoxArt ? review.title.tallBoxArt : review.title.boxArt'
              )
          v-col.py-0(cols='9')
            v-row
              v-col
                nuxt-link(
                  :to='$search.find((item) => Number(item.id) == review.title.id).r'
                )
                  h3 {{ review.title.title }}
              v-col.text-right
                div Overall Rating: {{ review.ratings.Overall }}
            p(v-html='content(review.content, index)')
            span.red-netflix--text.click.ml-1(
              v-if='expanded[index] && review.content.length > 300',
              @click='$set(expanded, index, false)'
            ) show less
            span.red-netflix--text.click.ml-1(
              v-else-if='review.content.length > 300',
              @click='$set(expanded, index, true)'
            ) show more
            .red-netflix--text {{ review.author.username }}
    v-row
      v-col
        h1.title-border RECOMMENDED GENRES
        v-row
          v-col(
            cols='4',
            v-for='category in $categories',
            :key='category.category',
            style='position: relative'
          )
            img(:src='category.image')
            div(
              style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
            )
            div(
              style='position: absolute; bottom: 30%; left: 0; padding: 30px'
            )
              h1 {{ category.category }}
              div {{ category.value }} Titles
    v-row
      v-col
        h1.title-border LATEST USER RECOMMENDATIONS
        v-row
          v-col(
            cols='4',
            v-for='recommendation in recommendationsLatest',
            :key='recommendation.id'
          )
            v-row
              v-col(cols='2')
                img(:src='recommendation.title.tallBoxArt')
              v-col(cols='4') If you liked
                .red-netflix--text {{ recommendation.title.title }}
              v-col(cols='2')
                img(:src='recommendation.similar.image')
              v-col(cols='4') Then you might like...
                .red-netflix--text {{ recommendation.similar.title }}
            v-row
              v-col
                p {{ recommendation.content }}
                div Recommendation by
                  span.red-netflix--text {{ " " + recommendation.author.username }}
                  span {{ " - " + $dateFns.format(new Date(recommendation.postedOn.seconds * 1000), "MMM d, yyyy").toUpperCase() }}
</template>
<script>
export default {
  async asyncData({ $getReviewsLatest, $getRecommendationsLatest }) {
    const reviewsLatest = await $getReviewsLatest();
    const recommendationsLatest = await $getRecommendationsLatest();
    return {
      reviewsLatest,
      recommendationsLatest,
      expanded: [false, false, false],
    };
  },
  methods: {
    content(content, index) {
      return !this.expanded[index] && content.length > 300
        ? content.substring(0, 300) + ' ...'
        : content;
    },
  },
  computed: {
    topSeries() {
      return this.$search
        .filter((title) => title.u)
        .sort((a, b) => (a.p < b.p ? -1 : 1))
        .slice(0, 5);
    },
  },
};
</script>
