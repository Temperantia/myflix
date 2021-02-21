<template lang="pug">
v-container(fluid, v-if='title')
  v-row
    v-col(cols='12')
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
        v-col
          ul(style='list-style-type: none')
            li.mr-3.d-md-inline
              share(isButton, :url='$config.baseUrl + $route.path')
            li.mr-3.d-md-inline
              nuxt-link(to='/vpn')
                v-btn.px-10(color='blue-completed') GET IT IN YOUR COUNTRY
            li.d-md-inline
              a(:href='"https://netflix.com/title/" + title.id')
                v-btn.px-10(color='red-netflix') WATCH ON NETFLIX
      v-row(v-if='connected')
        v-col
          ul(style='list-style-type: none')
            li.mr-3.d-md-inline(style='position: relative; width: 200px')
              v-select.d-md-inline-flex(
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
            li.mr-3.d-md-inline(style='width: 200px')
              v-select.d-md-inline-flex(
                :items='Object.entries(ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
                outlined,
                :value='score',
                dense,
                placeholder='Rate this title',
                :hide-details='true',
                @change='(value) => setScore(value)'
              )
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
            button.button.white--text(@click='update')
              v-icon(color='green-watching', v-if='title.saved') mdi-check
              span(v-else) UPDATE
  v-row
    v-col
      client-only
        h3.title-border OFFICIAL SYNOPSIS
        v-container(fluid)
          v-row
            v-col
              p(
                v-html='title.PlotOutline ? title.PlotOutline : "Not Available"'
              )
  v-row
    v-col
      h3.title-border CAST
      v-container(fluid)
        v-row
          template(v-if='title.Actors')
            v-col(
              v-for='[name, role] of title.Actors',
              cols='6',
              md='2',
              :key='name'
            )
              v-container(fluid)
                v-row
                  //-v-col(cols='3')
                    img(:src='')
                  v-col.pl-1.pt-1(cols='9')
                    div {{ name }}
                    div as
                      span.red-netflix--text.pl-2 {{ role }}
                    //-div(v-if='title.summary.type === "show"') {{ actor.episodes }}
          v-col(v-else)
            p Not Available
  v-row
    v-col
      h3.title-border CREDITS
      v-container(fluid)
        v-row
          template(
            v-if='title.ProductionCompanies || title.DistributorCompanies || title.SpecialEffects || title.OtherCompanies'
          )
            v-col(
              v-for='(value, key) of categories',
              cols='12',
              md='4',
              :key='key'
            )
              h4.mb-2 {{ value }}
              template(v-if='Object.keys(title[key]).length > 5')
                template(v-if='expanded[key]')
                  div(v-for='(credit, index) in title[key]', :key='index') {{ credit }}
                template(v-else)
                  div(v-for='(credit, index) in title[key].slice(0, 5)', :key='index') {{ credit }}
                .red-netflix--text.click(
                  v-if='expanded[key]',
                  @click='expanded = Object.assign({}, expanded, { [key]: false })'
                ) {{ " show less" }}
                .red-netflix--text.click(
                  v-else,
                  @click='expanded = Object.assign({}, expanded, { [key]: true })'
                ) {{ " show more" }}
              div(v-else, v-for='(credit, index) in title[key]', :key='index') {{ credit }}
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
  @titleModule.Mutation('setScore') setScore!: any;
  @titleModule.Mutation('setBingeworthy') setBingeworthy!: any;
  @titleModule.Mutation('updateStatus') updateStatus!: any;
  @titleModule.Mutation('updateEpisodes') updateEpisodes!: any;
  @titleModule.Action('loadFlixlist') loadflixlist!: any;
  @titleModule.Action('update') update!: any;

  expanded: { [key: string]: any } = {
    ProductionCompanies: false,
    DistributorCompanies: false,
    SpecialEffects: false,
    OtherCompanies: false,
  };
  categories = {
    ProductionCompanies: 'Production Companies',
    DistributorCompanies: 'Distributor Companies',
    SpecialEffects: 'Special Effects',
    OtherCompanies: 'Other Companies',
  };

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
