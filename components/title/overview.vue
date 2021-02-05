<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='12', md='9')
      v-row
        v-col(cols='10', offset='1', offset-md='0', md='3')
          card(
            title='SCORE',
            :content='title.score',
            :subtitle='title.numUsers + " users"'
          )
        v-col(cols='12', md='9')
          v-row
            v-col(cols='12', lg='4')
              h2 <span>Ranked </span>{{ "#" + title.rank }}
            v-col(cols='12', lg='4')
              h2 <span>Popularity </span>{{ "#" + title.popularity }}
            v-col(cols='12', lg='4')
              h2 <span>Following </span>{{ title.statistics.Followers }}
          div
            span.white-font--text {{ title.releaseYear }} | {{ title.maturity }}
            span.white-font--text(v-if='title.seasonCount') {{ " | " + title.seasonCount + (title.seasonCount > 1 ? " Seasons" : " Season") }}
            span.white-font--text {{ " | " + title.genres.map((genre) => genre.name).join(", ") }}
          div
            span.white-font--text Creators:
            span.ml-1 {{ title.creators.join(", ") || "-" }}
      v-row
        v-col(cols='12', lg='4')
          client-only
            div(style='position: relative')
              v-select(
                :items='statuses',
                outlined,
                :value='status',
                dense,
                placeholder='Change status',
                :hide-details='true',
                @change='(value) => updateStatus(value)'
              )
                template(v-slot:selection='{ item }')
                  span(
                    v-if='item !== "Remove from List"',
                    :class='$titleStatusColor(item)'
                  ) {{ item }}
              span.d-flex.align-center(
                v-if='title.summary.type === "show" && status && status !== "Save for Later"',
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
        v-col(cols='12', lg='4')
          client-only
            v-select(
              :items='Object.entries(ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
              outlined,
              :value='score',
              dense,
              placeholder='Rate this title',
              :hide-details='true',
              @change='(value) => setScore(value)'
            )
        v-col(cols='12', lg='4')
          v-btn(color='blue-completed', @click='$router.push("/vpn")') GET IT IN YOUR COUNTRY
      v-row.my-1
        v-col
          v-btn.mr-3(
            color='black-search',
            @click='setBingeworthy(!bingeworthy)'
          )
            v-icon(
              :class='bingeworthy ? "green-watching--text" : "greyButton--text"',
              left
            ) mdi-check
            span.font-weight-light(
              :class='bingeworthy ? "white--text" : "white-font--text"'
            ) Would you binge-watch this series?
          button.mr-3.button.white--text(@click='update')
            v-icon(color='green-watching', v-if='title.saved') mdi-check
            span(v-else) UPDATE
          share(isButton, :url='$config.baseUrl + $route.path')

    //-v-col(cols='12', md='3')
      video(:src='title.trailer')
  v-row
    v-col
      client-only
        h3.title-border OFFICIAL SYNOPSIS
        v-container(fluid)
          v-row
            v-col
              p(v-html='title.synopsis ? title.synopsis : "Not Available"')
  v-row
    v-col
      h3.title-border CAST
      v-container(fluid)
        v-row
          template(v-if='title.imdbCast')
            v-col(
              v-for='actor of title.imdbCast',
              cols='6',
              md='2',
              :key='actor.name'
            )
              v-container(fluid)
                v-row
                  v-col(cols='3')
                    img(:src='actor.image')
                  v-col.pl-1.pt-1(cols='9')
                    div {{ actor.name }}
                    div as
                      span.red-netflix--text.pl-2 {{ actor.character }}
                    div(v-if='title.summary.type === "show"') {{ actor.episodes }}
          v-col(v-else)
            p Not Available
  v-row
    v-col
      h3.title-border CREDITS
      v-container(fluid)
        v-row
          template(v-if='title.credits')
            v-col(
              v-for='(credits, category) in title.credits',
              cols='12',
              md='4',
              :key='category'
            )
              h4.mb-2 {{ category }}
              template(v-if='Object.keys(credits).length > 5')
                template(v-if='expanded[category]')
                  div(v-for='credit in credits', :key='credit') {{ credit }}
                template(v-else)
                  div(v-for='credit in credits.slice(0, 5)', :key='credit') {{ credit }}
                .red-netflix--text.click(
                  v-if='expanded[category]',
                  @click='$set(expanded, category, false)'
                ) {{ " show less" }}
                .red-netflix--text.click(
                  v-else,
                  @click='$set(expanded, category, true)'
                ) {{ " show more" }}
              div(v-else, v-for='credit in credits', :key='credit') {{ credit }}
          v-col(v-else)
            p Not Available
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');
const titleModule = namespace('title');

@Component
export default class Overview extends Vue {
  @titleModule.State('statusesTvShow') statusesTvShow!: any;
  @titleModule.State('ratings') ratings!: any;
  @titleModule.State('title') title!: any;
  @titleModule.State('status') status!: string;
  @titleModule.State('episodes') episodes!: number;
  @titleModule.State('score') score!: string;
  @titleModule.State('bingeworthy') bingeworthy!: boolean;
  @titleModule.State('saved') saved!: boolean;
  @localStorageModule.State('connected') connected!: boolean;
  @localStorageModule.State('user') user!: any;
  @localStorageModule.Getter('favorites') favorites!: any;
  @titleModule.Mutation('setScore') setScore!: any;
  @titleModule.Mutation('setBingeworthy') setBingeworthy!: any;
  @titleModule.Mutation('updateStatus') updateStatus!: any;
  @titleModule.Mutation('updateEpisodes') updateEpisodes!: any;
  @titleModule.Action('loadFlixlist') loadflixlist!: any;
  @titleModule.Action('update') update!: any;

  expanded: { [key: string]: any } = {};

  mounted() {
    if (!this.title.credits) {
      return;
    }
    for (const category in this.title.credits) {
      this.expanded[category] = false;
    }
  }

  get statuses() {
    return [...this.statusesTvShow, 'Remove from List'];
  }
}
</script>
<style lang="scss" scoped>
.title-border {
  font-size: 16px;
  font-weight: 500px;
}
h2 {
  font-size: 22px;

  span {
    font-weight: 300;
  }
}
</style>
