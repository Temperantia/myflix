<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 STATISTICS
      v-col.text-right(v-if='self')
        a(@click='setEdition(true)') EDIT
  v-container(fluid)
    v-row
      v-col(cols='12', lg='6')
        h4.subtitle-border TV SHOWS
        v-container(fluid)
          v-row
            v-col(cols='12', lg='5')
              doughnut-chart(
                :chartdata='tvShowsChartData',
                :options='optionsDoughnut'
              )
            v-col(cols='12', lg='7')
              .d-flex.justify-space-between(
                v-for='(stat, index) in tvShowsStats',
                :class='{ even: index % 2 === 1 }',
                :key='stat.name'
              )
                div {{ stat.name }}
                div(:class='stat.class ? stat.class : ""') {{ stat.value }}
      v-col(cols='12', lg='6')
        h4.subtitle-border LATEST TV SHOWS WATCHED
        v-container(v-if='tvShows.length > 0', fluid)
          v-row(
            align='center',
            v-for='element in tvShows.slice(0, 3)',
            :key='element.title.id'
          )
            v-col(cols='12', lg='2')
              img(:src='element.title.Poster', :alt='element.title.title')
            v-col(cols='12', lg='6')
              h2 {{ element.title.title }}
              .white-font--text {{ element.title.releaseYear }} {{ element.title.maturity }} {{ element.title.seasonCount }} Season
              progress-bar(
                :status='element.status',
                :episodes='element.episodes',
                :episodeCount='element.title.episodeCount'
              )
              div
                span.white-font--text {{ element.status }}
                span(v-if='element.status !== "Save for Later"')
                  span(:class='$titleStatusColor(element.status)') {{ " " + element.episodes }}
                  span.white-font--text /{{ element.title.episodeCount }}
                span.white-font--text {{ " • Scored " }}
                span(:class='$titleStatusColor(element.status)') {{ element.score || "-" }}
            v-col(cols='12', lg='4') {{ $moment(element.postedOn.seconds * 1000).format("MMM D, hh:ss a") }}
        v-container(v-else, fluid)
          v-row
            v-col
              p You have no recent tv shows
    v-row
      v-col(cols='12', lg='6')
        h4.subtitle-border FILMS
        v-container(fluid)
          v-row
            v-col(cols='12', lg='5')
              doughnut-chart(
                :chartdata='filmsChartData',
                :options='optionsDoughnut'
              )
            v-col(cols='12', lg='7')
              .d-flex.justify-space-between(
                v-for='(stat, index) in filmsStats',
                :class='{ even: index % 2 === 1 }',
                :key='stat.name'
              )
                div {{ stat.name }}
                div(:class='stat.class ? stat.class : ""') {{ stat.value }}
      v-col(cols='12', lg='6')
        h4.subtitle-border LATEST FILMS WATCHED
        v-container(v-if='films.length > 0', fluid)
          v-row(
            align='center',
            v-for='element in films.slice(0, 3)',
            :key='element.title.id'
          )
            v-col(cols='12', lg='2')
              img(:src='element.title.Poster', :alt='element.title.title')
            v-col(cols='12', lg='6')
              h2 {{ element.title.title }}
              .white-font--text {{ element.title.releaseYear }} {{ element.title.maturity }}
              div
                span.white-font--text(
                  :class='$titleStatusColor(element.status)'
                ) {{ element.status }}
                span.white-font--text {{ " • Scored " }}
                span(:class='$titleStatusColor(element.status)') {{ element.score || "-" }}
            v-col(cols='12', lg='4') {{ $moment(element.postedOn.seconds * 1000).format("MMM D, hh:ss a") }}
        v-container(v-else, fluid)
          v-row
            v-col
              p You have no recent films
  v-container(fluid)
    v-row.title-border
      v-col
        h3 FAVORITES
  v-container(fluid)
    v-row
      v-col(cols='12', lg='6')
        h4.subtitle-border TV SHOWS
        v-container(v-if='tvShowsFavorites.length > 0', fluid)
          v-row(v-for='(show, id) in profile.favorites.shows', :key='id')
            v-col(cols='12', lg='3')
              img(:src='show.image', :alt='show.title')
            v-col(cols='12', lg='9')
              h3 {{ show.title }}
              .white-font--text
                span {{ show.year + " " + show.maturity }}
                span {{ " " + show.season + " Seasons" }}
              .white-font--text {{ show.genres.join(", ") }}
        v-container(v-else, fluid)
          v-row
            v-col
              p No favorites yet
      v-col(cols='12', lg='6')
        h4.subtitle-border FILMS
        v-container(v-if='filmsFavorites.length > 0', fluid)
          v-row(v-for='(film, id) in profile.favorites.films', :key='id')
            v-col(cols='12', lg='3')
              img(:src='film.image', :alt='film.title')
            v-col(cols='12', lg='9')
              h3 {{ film.title }}
              .white-font--text {{ film.year + " " + film.maturity + " " + film.duration }}
              .white-font--text {{ film.genres.join(", ") }}
        v-container(v-else, fluid)
          v-row
            v-col
              p No favorites yet
</template>
<script lang='ts'>
import { Context } from '@nuxt/types';
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');

@Component({ layout: 'profile' })
export default class Profile extends Vue {
  @Prop({ type: Boolean }) edit!: boolean;

  @profileModule.State('profile') profile!: any;
  @profileModule.Getter('self') self!: any;
  @profileModule.Getter('tvShows') tvShows!: any;
  @profileModule.Getter('tvShowsStats') tvShowsStats!: any;
  @profileModule.Getter('tvShowsChartData') tvShowsChartData!: any;
  @profileModule.Getter('tvShowsFavorites') tvShowsFavorites!: any;
  @profileModule.Getter('films') films!: any;
  @profileModule.Getter('filmsStats') filmsStats!: any;
  @profileModule.Getter('filmsChartData') filmsChartData!: any;
  @profileModule.Getter('filmsFavorites') filmsFavorites!: any;
  @profileModule.Getter('tvShowsWatching') tvShowsWatching!: any;

  async asyncData({ route, store }: Context) {
    await store.dispatch('profile/loadUsername', route.params.username);
  }

  readonly optionsDoughnut = {
    cutoutPercentage: 95,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
  };
}
</script>
<style lang="scss" scoped>
.flixlist {
  color: white;
}
.even {
  background-color: $grey-flixlist;
}
</style>
