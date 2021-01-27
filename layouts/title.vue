<template lang="pug">
defaultLayout
  v-container.mt-4(fluid)
    v-row
      v-col(cols='12', lg='1')
      //- ad
      client-only
        v-col(cols='12', md='2')
          v-container(fluid)
            img(:src='title.tallBoxArt')
            .mt-5(
              v-if='!isCurrentTab(tabs[0].route) && $store.getters["localStorage/CONNECTED"]'
            )
              v-row.title-border(align='center')
                v-col
                  h3 YOUR OVERVIEW
                v-col.text-right
                  a.click(
                    v-if='isFavorite(title.id)',
                    @click='$removeFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                  ) Remove from Favorites
                  a.click(
                    v-else,
                    @click='$addFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                  ) Add to Favorites
              v-row(align='center')
                v-col(cols='12', xl='4') Status
                v-col(cols='12', xl='8')
                  client-only
                    div(style='position: relative')
                      v-select(
                        :items='statuses',
                        outlined,
                        :value='$store.state.title.status',
                        dense,
                        :hide-details='true',
                        @change='updateStatus'
                      )
                        template(v-slot:selection='{ item }')
                          span(
                            v-if='item !== "Remove from List"',
                            :class='$titleStatusColor(item)'
                          ) {{ item }}
                      span.d-flex.align-center(
                        v-if='title.summary.type === "show" && $store.state.title.status && $store.state.title.status !== "Save for Later"',
                        style='position: absolute; top: 0; bottom: 0; right: 35px'
                      )
                        input.pr-1.border.white-font--border.text-right(
                          :class='$titleStatusColor($store.state.title.status)',
                          style='width: 30px',
                          type='number',
                          :value='$store.state.title.episodes',
                          @input='updateEpisodes'
                        )
                        span.ml-1 {{ " / " + title.episodeCount }}
              v-row(align='center')
                v-col(cols='12', xl='4') Your Score
                v-col(cols='12', xl='8')
                  v-select(
                    :items='Object.entries($ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
                    outlined,
                    :value='$store.state.title.score',
                    dense,
                    :hide-details='true',
                    @change='(value) => $store.commit("title/UPDATE_SCORE", value)'
                  )
              v-row(align='center', v-if='title.summary.type === "show"')
                v-col
                  v-btn(
                    color='black-search',
                    @click='$store.commit("title/UPDATE_BINGEWORTHY", !$store.state.title.bingeworthy)'
                  )
                    v-icon(
                      :class='$store.state.title.bingeworthy ? "green-watching--text" : "greyButton--text"',
                      left
                    ) mdi-check
                    span.font-weight-light(
                      :class='$store.state.title.bingeworthy ? "white--text" : "white-font--text"'
                    ) Would you binge-watch this series?
              v-row(align='center')
                v-col.d-flex.justify-center
                  button.update(@click='update')
                    v-icon(
                      color='green-watching',
                      v-if='$store.state.title.saved'
                    ) mdi-check
                    span(v-else) UPDATE
          v-container(fluid)
            v-row.title-border(align='center')
              v-col
                h3 INFORMATION
              v-col.text-right-xl(
                md='12',
                xl='6',
                v-if='isCurrentTab(tabs[0].route)'
              )
                .click(
                  v-if='isFavorite(title.id)',
                  @click='$removeFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                )
                  v-icon mdi-star
                  span In Favorites
                .click(
                  v-else,
                  @click='$addFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                )
                  v-icon mdi-star-outline
                  span Add to Favorites
            v-row
              v-col
                table(v-for='(data, name) in title.information', :key='name')
                  th {{ name }}:
                  td {{ data || "-" }}
          v-container(fluid)
            v-row.title-border(align='center')
              v-col
                h3 STATISTICS
            v-row
              v-col
                table(v-for='(data, name) in title.statistics', :key='name')
                  th {{ name }}:
                  td {{ data }}
      v-col(cols='12', lg='8')
        v-container(fluid)
          v-row.title-border
            v-col(v-if='$vuetify.breakpoint.mdAndUp', md='12')
              nuxt-link(:to='tab.route', v-for='tab in tabs', :key='tab.name')
                h3.d-inline.mr-10(
                  :class='{ "red-netflix--text": isCurrentTab(tab.route) }'
                ) {{ tab.name }}
            v-col(v-else, v-for='tab in tabs', :key='tab.name', cols='12')
              nuxt-link(:to='tab.route')
                h3.d-inline.mr-10(
                  :class='{ "red-netflix--text": isCurrentTab(tab.route) }'
                ) {{ tab.name }}
        breadcrumb(:titleName='title.title')
        nuxt
      v-col(cols='12', md='2')
</template>
<script>
import DefaultLayout from '~/layouts/default.vue';

export default {
  middleware: ({ route, redirect, $search }) => {
    const parts = route.path.split('/');
    const toFind = '/' + parts[1] + '/' + parts[2];
    const result = $search.find((item) => item.r == toFind);
    if (!result) {
      return redirect('/');
    }
    route.params.id = result.id;
    if (
      (parts.length === 3 && route.path[route.path.length - 1] !== '/') ||
      (parts.length === 4 && route.path[route.path.length - 1] === '/')
    ) {
      return redirect(route.path + '/overview');
    }
  },
  components: { DefaultLayout },
  created() {
    if (this.flixlist) {
      this.$store.commit('title/LOAD_FLIXLIST', this.flixlist);
    }
  },
  computed: {
    statuses() {
      const statuses = this.$statusesTvShow;
      return [...statuses, 'Remove from List'];
    },
    user() {
      return this.$store.getters['localStorage/USER'];
    },
    flixlist() {
      return this.user ? this.user.flixlist[this.title.id] : null;
    },
    favorites() {
      return this.user ? this.user.favorites : null;
    },
    title() {
      return this.$store.getters['title/TITLE'];
    },
    tabs() {
      const index = this.$route.path.lastIndexOf('/') + 1;
      const routeTitle = this.$route.path.substr(0, index);
      return [
        {
          name: 'OVERVIEW',
          route: routeTitle + 'overview',
        },
        {
          name: 'REVIEWS',
          route: routeTitle + 'reviews',
        },
        {
          name: 'SUGGESTIONS',
          route: routeTitle + 'suggestions',
        },
        /* {
        name: 'NEWS',
        route: routeTitle + 'news',
      }, */
        {
          name: 'GOODS',
          route: routeTitle + 'goods',
        } /*
      {
        name: 'MEDIA',
        route: routeTitle + 'media',
      }, */,
      ];
    },
  },
  methods: {
    isFavorite(id) {
      return (
        !!this.favorites &&
        !!this.favorites[
          this.title.summary.type === 'show' ? 'shows' : 'films'
        ] &&
        !!this.favorites[
          this.title.summary.type === 'show' ? 'shows' : 'films'
        ][id]
      );
    },
    isCurrentTab(route) {
      return route === this.$route.path;
    },
    async update() {
      if (!this.$store.state.title.saved) {
        await this.$updateFlixlist(
          {
            id: this.title.id,
            title: this.title.title,
            summary: this.title.summary,
            tallBoxArt: this.title.tallBoxArt,
            releaseYear: this.title.releaseYear,
            maturity: this.title.maturity,
            episodeCount: this.title.episodeCount,
          },
          this.$store.state.title.status,
          Number(this.$store.state.title.episodes),
          this.$store.state.title.score
            ? Number(this.$store.state.title.score.split('-')[0])
            : null,
          this.$store.state.title.bingeworthy
        );
      }
    },
    updateStatus(value) {
      this.$store.commit('title/UPDATE_STATUS', {
        value,
        title: this.title,
      });
    },
    updateEpisodes(event) {
      const value = event.target.value;
      this.$store.commit('title/UPDATE_EPISODES', { value, title: this.title });
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  max-width: 100%;
}
input {
  padding-left: 5px;
  color: white;
  border: 1px solid white;
  width: 50px;
  border-radius: 5px;
}
fieldset {
  border-color: white;
}
.update {
  padding: 5px 30px;
  border: 1px solid $red-netflix;
  color: $red-netflix;
}
.breadcrumb {
  padding: 0px 12px 12px 12px;
  margin-top: 12px;
}
.titleTabs {
  padding-left: 0px;
  padding-bottom: 5px;
}
.tabsRow {
  padding: 0px 20px;
}
h3 {
  font-size: 16px;
  font-weight: 500;

  .text-h5.title-border {
    font-size: 16px;
    font-weight: 500;
  }
}
table {
  width: 100%;
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.2);
  }

  th {
    text-align: left;
  }

  td {
    text-align: right;
  }
}
</style>
