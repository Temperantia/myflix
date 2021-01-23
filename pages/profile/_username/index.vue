<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 STATISTICS
      v-col.text-right(v-if='self')
        a(@click='$nuxt.$emit("edit", true)') EDIT
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
        h4.subtitle-border LATEST TV SHOWS WATCHED
        v-container(v-if='tvShows.length > 0', fluid)
          v-row(
            align='center',
            v-for='element in tvShows.slice(0, 3)',
            :key='element.title.id'
          )
            v-col(cols='12', lg='2')
              img(:src='element.title.tallBoxArt')
            v-col(cols='12', lg='6')
              h2 {{ element.title.title }}
              .white-font--text {{ element.title.releaseYear }} {{ element.title.maturity }} {{ element.title.seasonCount }} Season
              progress-bar(
                :status='element.status',
                :episodes='element.episodes',
                :episodeCount='element.title.episodeCount',
                :width='200'
              )
              div
                span.white-font--text {{ element.status }}
                span(v-if='element.status !== "Save for Later"')
                  span(:class='$titleStatusColor(element.status)') {{ " " + element.episodes }}
                  span.white-font--text /{{ element.title.episodeCount }}
                span.white-font--text {{ " • Scored " }}
                span(:class='$titleStatusColor(element.status)') {{ element.score || "-" }}
            v-col(cols='12', lg='4') {{ $moment(element.postedOn.seconds * 1000).format("MMM D, hh:ss a") }}
        v-container(v-else, fluid, style='height: 227px')
          v-row
            v-col
              p You have no recent tv shows
        h4.subtitle-border LATEST FILMS WATCHED
        v-container(v-if='films.length > 0', fluid)
          v-row(
            align='center',
            v-for='element in films.slice(0, 3)',
            :key='element.title.id'
          )
            v-col(cols='12', lg='2')
              img(:src='element.title.tallBoxArt')
            v-col(cols='12', lg='6')
              h2 {{ element.title.title }}
              .white-font--text {{ element.title.releaseYear }} {{ element.title.maturity }}
              div
                span.white-font--text(:class='$titleStatusColor(element.status)') {{ element.status }}
                span.white-font--text {{ " • Scored " }}
                span(:class='$titleStatusColor(element.status)') {{ element.score || "-" }}
            v-col(cols='12', lg='4') {{ $moment(element.postedOn.seconds * 1000).format("MMM D, hh:ss a") }}
        v-container(v-else, fluid, style='height: 227px')
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
        v-container(v-if='Object.keys(user.favorites.shows).length > 0', fluid)
          v-row(v-for='(show, id) in user.favorites.shows', :key='id')
            v-col(cols='12', lg='3')
              img(:src='show.image')
            v-col(cols='12', lg='9')
              h3 {{ show.title }}
              .white-font--text
                span {{ show.year + " " + show.maturity }}
                span {{ " " + show.season + " Seasons" }}
              .white-font--text {{ show.genres.map((genre) => genre.name).join(", ") }}
        v-container(v-else, fluid, style='height: 227px')
          v-row
            v-col
              p No favorites yet
      v-col(cols='12', lg='6')
        h4.subtitle-border FILMS
        v-container(v-if='Object.keys(user.favorites.films).length > 0', fluid)
          v-row(v-for='(film, id) in user.favorites.films', :key='id')
            v-col(cols='12', lg='3')
              img(:src='film.image')
            v-col(cols='12', lg='9')
              h3 {{ film.title }}
              .white-font--text {{ film.year + " " + film.maturity + " " + film.duration }}
              .white-font--text {{ film.genres.map((genre) => genre.name).join(", ") }}
        v-container(v-else, fluid, style='height: 227px')
          v-row
            v-col
              p No favorites yet
</template>
<script>
export default {
  layout: 'profile',
  props: ['edit'],
  data: () => ({
    optionsDoughnut: {
      cutoutPercentage: 95,
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
      tooltips: {
        enabled: false,
      },
    },
  }),
  async asyncData({ route, store }) {
    const username = route.params.username;
    await store.dispatch('profile/LOAD_USERNAME', username);
  },
  computed: {
    user() {
      return this.$store.getters['profile/PROFILE'];
    },
    self() {
      return this.$store.getters['profile/SELF'];
    },
    tvShowsStats() {
      return [
        {
          name: 'Watching',
          value: this.tvShowsWatching.length,
          class: 'green-watching--text',
        },
        {
          name: 'Completed',
          value: this.tvShowsCompleted.length,
          class: 'blue-completed--text',
        },
        {
          name: 'On-Hold',
          value: this.tvShowsOnHold.length,
          class: 'yellow-on-hold--text',
        },
        {
          name: 'Dropped',
          value: this.tvShowsDropped.length,
          class: 'red-dropped--text',
        },
        {
          name: 'Save for Later',
          value: this.tvShowsPlanToWatch.length,
          class: 'grey-save-for-later--text',
        },
        { name: 'Total Entries', value: this.tvShows.length },
        { name: 'Episodes', value: this.tvShowsEpisodes },
      ];
    },
    tvShows() {
      return this.$store.getters['profile/TVSHOWS'];
    },
    tvShowsWatching() {
      return this.tvShows.filter((element) => element.status === 'Watching');
    },
    tvShowsCompleted() {
      return this.tvShows.filter((element) => element.status === 'Completed');
    },
    tvShowsOnHold() {
      return this.tvShows.filter((element) => element.status === 'On-Hold');
    },
    tvShowsDropped() {
      return this.tvShows.filter((element) => element.status === 'Dropped');
    },
    tvShowsPlanToWatch() {
      return this.tvShows.filter(
        (element) => element.status === 'Save for Later'
      );
    },
    tvShowsEpisodes() {
      return Number(
        this.tvShows.reduce((sum, tvShow) => sum + tvShow.episodes, 0)
      );
    },
    tvShowsChartData() {
      return this.tvShowsWatching.length ||
        this.tvShowsCompleted.length ||
        this.tvShowsOnHold.length ||
        this.tvShowsDropped.length ||
        this.tvShowsPlanToWatch.length
        ? {
            datasets: [
              {
                backgroundColor: [
                  '#6dee76',
                  '#576bec',
                  '#f2921c',
                  '#f51c1f',
                  '#888888',
                ],
                data: [
                  this.tvShowsWatching.length,
                  this.tvShowsCompleted.length,
                  this.tvShowsOnHold.length,
                  this.tvShowsDropped.length,
                  this.tvShowsPlanToWatch.length,
                ],
              },
            ],
          }
        : {
            datasets: [
              {
                backgroundColor: ['#1b1b1b'],
                data: [1],
              },
            ],
          };
    },
    filmsStats() {
      return [
        {
          name: 'Watching',
          value: this.filmsWatching.length,
          class: 'green-watching--text',
        },
        {
          name: 'Completed',
          value: this.filmsCompleted.length,
          class: 'blue-completed--text',
        },
        {
          name: 'On-Hold',
          value: this.filmsOnHold.length,
          class: 'yellow-on-hold--text',
        },
        {
          name: 'Dropped',
          value: this.filmsDropped.length,
          class: 'red-dropped--text',
        },
        {
          name: 'Save for Later',
          value: this.filmsPlanToWatch.length,
          class: 'grey-save-for-later--text',
        },
        { name: 'Total Entries', value: this.films.length },
      ];
    },
    films() {
      return this.$store.getters['profile/FILMS'];
    },
    filmsWatching() {
      return this.films.filter((element) => element.status === 'Watching');
    },
    filmsCompleted() {
      return this.films.filter((element) => element.status === 'Completed');
    },
    filmsOnHold() {
      return this.films.filter((element) => element.status === 'On-Hold');
    },
    filmsDropped() {
      return this.films.filter((element) => element.status === 'Dropped');
    },
    filmsPlanToWatch() {
      return this.films.filter(
        (element) => element.status === 'Save for Later'
      );
    },
    filmsEpisodes() {
      return Number(
        this.films.reduce((sum, tvShow) => sum + tvShow.episodes, 0)
      );
    },
    filmsChartData() {
      return this.filmsWatching.length ||
        this.filmsCompleted.length ||
        this.filmsOnHold.length ||
        this.filmsDropped.length ||
        this.filmsPlanToWatch.length
        ? {
            datasets: [
              {
                backgroundColor: [
                  '#6dee76',
                  '#576bec',
                  '#f2921c',
                  '#f51c1f',
                  '#888888',
                ],
                data: [
                  this.filmsWatching.length,
                  this.filmsCompleted.length,
                  this.filmsOnHold.length,
                  this.filmsDropped.length,
                  this.filmsPlanToWatch.length,
                ],
              },
            ],
          }
        : {
            datasets: [
              {
                backgroundColor: ['#1b1b1b'],
                data: [1],
              },
            ],
          };
    },
  },
};
</script>
<style lang="scss" scoped>
.flixlist {
  color: white;
}
.even {
  background-color: $grey-flixlist;
}
</style>
