<template lang="pug">
defaultLayout
  v-container(fluid, v-if='title')
    v-row
      v-col(cols='12', md='2')
        v-container(fluid)
          img(:src='title.tallBoxArt')
          .mt-5(v-if='!isCurrentTab(tabs[0].route) && connected')
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
                      :value='status',
                      dense,
                      :hide-details='true',
                      @change='(value) => updateStatus(value)'
                    )
                      template(v-slot:selection='{ item }')
                        span(
                          v-if='item !== "Remove from List"',
                          :class='$titleStatusColor(item)'
                        ) {{ item }}
                    span.d-flex.align-center(
                      v-if='title.summary.type === "show" && title.episodeCount > 0 && status && status !== "Save for Later"',
                      style='position: absolute; top: 0; bottom: 0; right: 35px'
                    )
                      input.pr-1.border.white-font--border.text-right(
                        :class='$titleStatusColor(status)',
                        style='width: 30px',
                        type='number',
                        :value='episodes',
                        @input='(event) => updateEpisodes(event.target.value)'
                      )
                      span.ml-1 {{ " / " + title.episodeCount }}
            v-row(align='center')
              v-col(cols='12', xl='4') Your Score
              v-col(cols='12', xl='8')
                v-select(
                  :items='Object.entries(ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
                  outlined,
                  :value='score',
                  dense,
                  :hide-details='true',
                  @change='(value) => setScore(value)'
                )
            v-row(align='center', v-if='title.summary.type === "show"')
              v-col
                v-btn(
                  color='black-search',
                  @click='setBingeworthy(!bingeworthy)'
                )
                  v-icon(
                    :class='title.bingeworthy ? "green-watching--text" : "greyButton--text"',
                    left
                  ) mdi-check
                  span.font-weight-light(
                    :class='title.bingeworthy ? "white--text" : "white-font--text"'
                  ) Would you binge-watch this series?
            v-row(align='center')
              v-col.d-flex.justify-center
                button.update(@click='update')
                  v-icon(color='green-watching', v-if='title.saved') mdi-check
                  span(v-else) UPDATE
        v-container(fluid)
          v-row.title-border(align='center')
            v-col
              h3 INFORMATION
            v-col.text-xl-right(
              md='12',
              xl='6',
              v-if='connected && isCurrentTab(tabs[0].route)'
            )
              .click(v-if='isFavorite(title.id)', @click='removeFavorite')
                v-icon mdi-star
                span In Favorites
              .click(v-else, @click='addFavorite')
                v-icon mdi-star-outline
                span Add to Favorites
          v-row
            v-col
              client-only
                table(v-for='(data, name) in title.information', :key='name')
                  th {{ name }}:
                  td {{ data || "-" }}
        v-container(fluid)
          v-row.title-border(align='center')
            v-col
              h3 STATISTICS
          v-row
            v-col
              client-only
                table(v-for='(data, name) in title.statistics', :key='name')
                  th {{ name }}:
                  td {{ data }}
      v-col(cols='12', md='10', xl='8')
        v-container(fluid)
          ul.title-border
            li.d-block.d-md-inline(
              v-for='tab in tabs',
              :key='tab.name',
            )
              nuxt-link(:to='tab.route')
                h3.d-inline.mr-10(
                  :class='{ "red-netflix--text": isCurrentTab(tab.route) }'
                ) {{ tab.name }}
        breadcrumb(:titleName='title.title')
        nuxt
</template>
<script lang='ts'>
import DefaultLayout from '~/layouts/default.vue';
import { Vue, Component, namespace, Watch } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');
const titleModule = namespace('title');

@Component({
  components: { DefaultLayout },
})
export default class Title extends Vue {
  @titleModule.State('statusesTvShow') statusesTvShow!: any;
  @titleModule.State('title') title!: any;
  @titleModule.State('status') status!: string;
  @titleModule.State('episodes') episodes!: number;
  @titleModule.State('score') score!: string;
  @titleModule.State('bingeworthy') bingeworthy!: boolean;
  @titleModule.State('saved') saved!: boolean;
  @titleModule.State('ratings') ratings!: any;
  @localStorageModule.State('connected') connected!: boolean;
  @localStorageModule.State('user') user!: any;
  @localStorageModule.Getter('favorites') favorites!: any;
  @titleModule.Mutation('setScore') setScore!: any;
  @titleModule.Mutation('setBingeworthy') setBingeworthy!: any;
  @titleModule.Mutation('updateStatus') updateStatus!: any;
  @titleModule.Mutation('updateEpisodes') updateEpisodes!: any;
  @titleModule.Action('update') update!: any;
  @titleModule.Action('get') get!: any;
  @titleModule.Action('redirect') redirect!: any;
  @localStorageModule.Action('addFavorite') addFavorite!: any;
  @localStorageModule.Action('removeFavorite') removeFavorite!: any;

  mounted() {
    this.redirect({ route: this.$route, cookies: this.$cookies });
  }

  @Watch('$route')
  onRouteChanged() {
    this.redirect({ route: this.$route, cookies: this.$cookies });
  }

  get statuses() {
    return [...this.statusesTvShow, 'Remove from List'];
  }

  get tabs() {
    const index: number = this.$route.path.lastIndexOf('/') + 1;
    const routeTitle: string = this.$route.path.substr(0, index);
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
      },
      {
        name: 'MEDIA',
        route: routeTitle + 'media',
      },
    ];
  }

  isFavorite(id: string) {
    return !!this.favorites?.[
      this.title.summary.type === 'show' ? 'shows' : 'films'
    ]?.[id];
  }

  isCurrentTab(route: string): boolean {
    return route === this.$route.path;
  }
}
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
