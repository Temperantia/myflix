<template lang="pug">
div
  trending-week
  premieres
  v-container.px-10(fluid)
    v-row
      v-col(cols='12', lg='7')
        h1.title-border.font-weight-bold TOP 5 MOST POPULAR ONGOING SERIES
        h2.font-weight-regular.subtitle.py-3 {{ $moment().format("MMM D, yyyy").toUpperCase() }}
        client-only
          v-container(fluid)
            v-row.my-2.top5List(v-for='(item, index) in topSeries', :key='item.id')
              v-col.text-center(cols='1')
                h1.font-weight-black {{ index + 1 }}
              v-col(cols='11', lg='3')
                nuxt-link(:to='item.r')
                  img(:src='item.i')
              v-col(
                offset='1',
                cols='11',
                offset-lg='0',
                :lg='favorites ? "5" : "8"'
              )
                nuxt-link(:to='item.r')
                  h2 {{ item.t }}
                i
                  span {{ item.s + " seasons" }}
                  span(v-if='item.e') {{ ", " + item.e + " episodes" }}
                div
                  span {{ "Score " }}
                  span.red-netflix--text {{ item.z + "/10" }}
                div Released {{ item.a ? $moment(item.a).format("MMM D, yyyy") : "-" }}
                div
                  span.red-netflix--text {{ item.f + " members " }}
                  span watching this
              v-col(cols='12', md='3', v-if='favorites')
                client-only(v-if='favorites')
                  .click(
                    v-if='isFavorite(item.id)',
                    @click='removeFavoriteFromId(item.id)'
                  )
                    v-icon.mr-2 mdi-star
                    span In Favorites
                  .click(v-else, @click='addFavoriteFromId(item.id)')
                    v-icon.mr-2 mdi-star-outline
                    span Add to Favorites
      v-col(cols='12', lg='5')
        h1.title-border.font-weight-bold LATEST USER REVIEWS
        v-container(fluid)
          v-row.my-2.userReviews(
            v-for='(review, index) in reviewsLatest',
            :key='review.id'
          )
            v-col.mh-Review(cols='12', md='2')
              nuxt-link(
                :to='$search.find((item) => Number(item.id) == review.title.id).r'
              )
                img(
                  :src='review.title.tallBoxArt ? review.title.tallBoxArt : review.title.boxArt'
                )
              client-only(v-if='favorites')
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
                  nuxt-link(
                    :to='$search.find((item) => Number(item.id) == review.title.id).r'
                  )
                    h3 {{ review.title.title }}
                v-col.text-right-lg(cols='12', lg='6')
                  div Overall Rating: {{ review.ratings.Overall }}
              p.font-weight-light
                span(v-html='content(review.content, index)')
                span.red-netflix--text.click.ml-1(
                  v-if='expanded[index] && review.content.length > 300',
                  @click='$set(expanded, index, false)'
                ) show less
                span.red-netflix--text.click.ml-1(
                  v-else-if='review.content.length > 300',
                  @click='$set(expanded, index, true)'
                ) show more
              .spacer
              div.reviewBy
                span Review by
                client-only
                  nuxt-link(:to='"/profile/" + review.author.username')
                    span.red-netflix--text.font-weight-bold {{ " " + review.author.username }}
                span {{ " - " + $moment(review.postedOn.seconds * 1000).format("MMM D, yyyy").toUpperCase() }}
              client-only(v-if='favorites')
                .click.faveButton(
                  v-if='isFavorite(review.title.id)',
                  @click='removeFavoriteFromId(review.title.id)'
                )
                  v-icon.mr-2 mdi-star
                  span.d-none.d-md-inline-flex In Favorites
                .click.faveButton(v-else, @click='addFavoriteFromId(review.title.id)')
                  v-icon.mr-2 mdi-star-outline
                  span.d-none.d-md-inline-flex Add to Favorites

    v-row
      v-col
        h1.title-border.font-weight-bold SUGGESTED GENRES
        v-container(fluid)
          v-row
            v-col.click(
              cols='12',
              lg='4',
              v-for='category in $categories',
              :key='category.category',
              style='position: relative',
              @click='$router.push({ name: "titles", params: { category: category.category } })'
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
      v-col(cols='12', lg='5')
        h1.title-border.font-weight-bold LATEST USER SUGGESTIONS
    v-row
      v-col(
        cols='12',
        lg='4',
        v-for='suggestion in suggestionsLatest',
        :key='suggestion.id'
      )
        v-container(fluid)
          v-row
            v-col(cols='4', lg='2')
              nuxt-link(
                :to='$search.find((item) => Number(item.id) == suggestion.title.id).r'
              )
                img(:src='suggestion.title.tallBoxArt')
            v-col(cols='8', lg='4') If you liked
              nuxt-link(
                :to='$search.find((item) => Number(item.id) == suggestion.title.id).r'
              )
                .red-netflix--text {{ suggestion.title.title }}
              client-only(v-if='favorites')
                .click(
                  v-if='isFavorite(suggestion.title.id)',
                  @click='removeFavoriteFromId(suggestion.title.id)'
                )
                  v-icon mdi-star
                  span In Favorites
                .click(v-else, @click='addFavoriteFromId(suggestion.title.id)')
                  v-icon mdi-star-outline
                  span Add to Favorites
            v-col(cols='4', lg='2')
              img(:src='suggestion.similar.image')
            v-col(cols='8', lg='4') Then you might like...
              .red-netflix--text {{ suggestion.similar.title }}
              client-only(v-if='favorites')
                .click(
                  v-if='isFavorite(suggestion.similar.id)',
                  @click='removeFavoriteFromId(suggestion.similar.id)'
                )
                  v-icon mdi-star
                  span In Favorites
                .click(
                  v-else,
                  @click='addFavoriteFromId(suggestion.similar.id)'
                )
                  v-icon mdi-star-outline
                  span Add to Favorites
          v-row
            v-col
              p {{ suggestion.content }}
              div Suggestion by
                client-only
                  nuxt-link(:to='"/profile/" + suggestion.author.username')
                    span.red-netflix--text {{ " " + suggestion.author.username }}
                span {{ " - " + $moment(suggestion.postedOn.seconds * 1000).format("MMM D, yyyy").toUpperCase() }}
</template>
<script>
export default {
  async asyncData({ $getReviewsLatest, $getSuggestionsLatest }) {
    const reviewsLatest = await $getReviewsLatest();
    const suggestionsLatest = await $getSuggestionsLatest();
    return {
      reviewsLatest,
      suggestionsLatest,
      expanded: [false, false, false],
    };
  },
  methods: {
    content(content, index) {
      return !this.expanded[index] && content.length > 300
        ? content.substring(0, 300) + ' ...'
        : content;
    },
    isFavorite(id) {
      if (!id) {
        return false;
      }
      const title = this.$search.find(
        (title) => Number(title.id) === Number(id)
      );
      return (
        !!this.favorites &&
        !!this.favorites[title.u ? 'shows' : 'films'] &&
        !!this.favorites[title.u ? 'shows' : 'films'][id]
      );
    },
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
    },
    addFavoriteFromId(id) {
      const title = this.$search.find(
        (title) => Number(title.id) === Number(id)
      );
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
    },
    removeFavorite(title) {
      this.$removeFavorite({ id: title.id }, title.u ? 'shows' : 'films');
    },
    removeFavoriteFromId(id) {
      const title = this.$search.find(
        (title) => Number(title.id) === Number(id)
      );
      this.$removeFavorite({ id: title.id }, title.u ? 'shows' : 'films');
    },
  },
  computed: {
    user() {
      return this.$store.getters['localStorage/USER'];
    },
    favorites() {
      if (this.user) {
        return this.user.favorites;
      }
    },
    topSeries() {
      return this.$search
        .filter((title) => title.u)
        .sort((a, b) => (a.p < b.p ? -1 : 1))
        .slice(0, 5);
    },
  },
};
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
.top5List {
  border-bottom: 1px $grey-google solid;

  .click {
    text-align: right;

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
