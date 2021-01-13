<template lang="pug">
client-only(v-if='user')
  profile-edition(v-if='edition', :user='user', :save='save')
  v-container(v-else, fluid)
    v-row
      v-col(cols='12', lg='2')
        img(:src='user.image ? user.image : "/defaultUser.png"')
        v-row
          v-col.pt-1.pb-0
            b Gender:
          v-col.pt-1.pb-0.text-right {{ user.gender || "-" }}
        v-row
          v-col.pt-1.pb-0
            b Birthday:
          v-col.pt-1.pb-0.text-right {{ user.birthdate ? new Date(user.birthdate.seconds * 1000).getFullYear() : "-" }}
        v-row
          v-col.pt-1.pb-0
            b Location:
          v-col.pt-1.pb-0.text-right {{ user.location || "-" }}
        v-row
          v-col.pt-1.pb-0
            b Join Date:
          v-col.pt-1.pb-0.text-right {{ $dateFns.format(user.created.seconds * 1000, "MMM d, yyyy") }}
        v-row
          v-col.text-center
            nuxt-link(:to='"/flixlist/" + user.username')
              button.button.flixlist FlixList
        h3.title-border INFORMATION
        v-row
          v-col.pt-1.pb-0
            b Reviews:
          v-col.pt-1.pb-0.text-right {{ user.reviews.length }}
        v-row
          v-col.pt-1.pb-0
            b Recommendations:
          v-col.pt-1.pb-0.text-right {{ user.recommendations.length }}
        v-row
          v-col.pt-1.pb-0
            b Films:
          v-col.pt-1.pb-0.text-right {{ films.length }}
        v-row
          v-col.pt-1.pb-0
            b TV Shows:
          v-col.pt-1.pb-0.text-right {{ tvShows.length }}
      v-col(cols='12', lg='10')
        v-row.title-border
          v-col
            h3 STATISTICS
          v-col.text-right(v-if='self')
            a(@click='edition = true') EDIT
        v-row
          v-col(cols='12', lg='6')
            h4.subtitle-border TV SHOWS
            v-row
              v-col(cols='12', lg='5')
                doughnut-chart(
                  :chartdata='tvShowsChartData',
                  :options='optionsDoughnut'
                )
              v-col(cols='12', lg='7')
                v-row(
                  v-for='(stat, index) in tvShowsStats',
                  :class='{ even: index % 2 === 1 }',
                  :key='stat.name'
                )
                  v-col.py-1 {{ stat.name }}
                  v-col.py-1.text-right
                    div(:class='stat.class ? stat.class : ""') {{ stat.value }}
            h4.subtitle-border FILMS
            v-row
              v-col(cols='12', lg='5')
                doughnut-chart(
                  :chartdata='filmsChartData',
                  :options='optionsDoughnut'
                )
              v-col(cols='12', lg='7')
                v-row(
                  v-for='(stat, index) in filmsStats',
                  :class='{ even: index % 2 === 1 }',
                  :key='stat.name'
                )
                  v-col.py-1 {{ stat.name }}
                  v-col.py-1.text-right
                    div(:class='stat.class ? stat.class : ""') {{ stat.value }}
          v-col(cols='12', lg='6')
            h4.subtitle-border LATEST TV SHOWS WATCHED
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
                  :episodeCount='element.title.episodeCount'
                )
                div
                  span.white-font--text {{ element.status }}
                  span(v-if='element.status !== "Plan to Watch"')
                    span(
                      :class='textColor(element.title.summary.type, element.status)'
                    ) {{ " " + element.episodes }}
                    span.white-font--text /{{ element.title.episodeCount }}
                  span.white-font--text {{ " • Scored " }}
                  span(
                    :class='textColor(element.title.summary.type, element.status)'
                  ) {{ element.score || "-" }}
              v-col(cols='12', lg='4') {{ $dateFns.format(element.postedOn.seconds * 1000, "MMM d, hh:ss a") }}
            h4.subtitle-border LATEST FILMS WATCHED
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
                  span.white-font--text(
                    :class='textColor(element.title.summary.type, element.status)'
                  ) {{ element.status }}
                  span.white-font--text {{ " • Scored " }}
                  span(
                    :class='textColor(element.title.summary.type, element.status)'
                  ) {{ element.score || "-" }}
              v-col(cols='12', lg='4') {{ $dateFns.format(element.postedOn.seconds * 1000, "MMM d, hh:ss a") }}
        v-row.title-border
          v-col
            h3 FAVORITES
        v-row
          v-col(cols='12', lg='6')
            h4.subtitle-border TV SHOWS
            v-row(v-for='(show, id) in user.favorites.shows', :key='id')
              v-col(cols='12', lg='3')
                img(:src='show.image')
              v-col(cols='12', lg='9')
                h3 {{ show.title }}
                .white-font--text
                  span {{ show.year + " " + show.maturity }}
                  span {{ " " + show.season + " Seasons" }}
                .white-font--text {{ show.genres.map((genre) => genre.name).join(", ") }}
          v-col(cols='12', lg='6')
            h4.subtitle-border FILMS
            v-row(v-for='(film, id) in user.favorites.films', :key='id')
              v-col(cols='12', lg='3')
                img(:src='film.image')
              v-col(cols='12', lg='9')
                h3 {{ film.title }}
                .white-font--text {{ film.year + " " + film.maturity + " " + film.duration }}
                .white-font--text {{ film.genres.map((genre) => genre.name).join(", ") }}
</template>
<script>
export default {
  data: () => ({
    edition: false,
    self: false,
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
  async asyncData({ route, $getUser, store }) {
    const username = route.params.username;
    const userOther = await $getUser(username);
    return { userOther };
  },
  computed: {
    user() {
      const username = this.$route.params.username;
      const userCurrent = this.$store.getters['localStorage/USER'];
      if (userCurrent && username === userCurrent.username) {
        this.self = true;
        return userCurrent;
      }
      return this.userOther;
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
          name: 'Plan to Watch',
          value: this.tvShowsPlanToWatch.length,
          class: 'grey-plan-to-watch--text',
        },
        { name: 'Total Entries', value: this.tvShows.length },
        { name: 'Episodes', value: this.tvShowsEpisodes },
      ];
    },

    tvShows() {
      return Object.values(this.user.flixlist).filter(
        (element) =>
          element.status !== 'Unwatched' &&
          element.title.summary.type === 'show'
      );
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
        (element) => element.status === 'Plan to Watch'
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
          name: 'Completed',
          value: this.filmsCompleted.length,
          class: 'blue-completed--text',
        },
        {
          name: 'Rewatched',
          value: this.filmsRewatched.length,
          class: 'yellow-on-hold--text',
        },
        {
          name: 'Unfinished',
          value: this.filmsUnfinished.length,
          class: 'red-dropped--text',
        },
        {
          name: 'Plan to Watch',
          value: this.filmsPlanToWatch.length,
          class: 'grey-plan-to-watch--text',
        },
        { name: 'Total Entries', value: this.films.length },
      ];
    },
    films() {
      return Object.values(this.user.flixlist).filter(
        (element) =>
          element.status !== 'Unwatched' &&
          element.title.summary.type === 'movie'
      );
    },
    filmsCompleted() {
      return this.films.filter((element) => element.status === 'Watching');
    },
    filmsRewatched() {
      return this.films.filter((element) => element.status === 'Rewatched');
    },
    filmsUnfinished() {
      return this.films.filter((element) => element.status === 'Unfinished');
    },
    filmsPlanToWatch() {
      return this.films.filter((element) => element.status === 'Plan to Watch');
    },
    filmsChartData() {
      return this.filmsCompleted.length ||
        this.filmsRewatched.length ||
        this.filmsUnfinished.length ||
        this.filmsPlanToWatch.length
        ? {
            datasets: [
              {
                backgroundColor: ['#576bec', '#f2921c', '#f51c1f', '#888888'],
                data: [
                  this.filmsCompleted.length,
                  this.filmsRewatched.length,
                  this.filmsUnfinished.length,
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
  methods: {
    async save(copy, passwordNew, passwordCurrent, email, username) {
      if (
        await this.$updateUser(
          copy,
          passwordNew,
          passwordCurrent,
          email,
          username
        )
      ) {
        this.edition = false;
      }
    },
    textColor(type, status) {
      if (type === 'show') {
        if (status === 'Watching') {
          return 'green-watching--text';
        } else if (status === 'Completed') {
          return 'blue-completed--text';
        } else if (status === 'On-Hold') {
          return 'yellow-on-hold--text';
        } else if (status === 'Dropped') {
          return 'red-dropped--text';
        } else if (status === 'Plan to Watch') {
          return 'grey-plan-to-watch--text';
        }
      }
      if (status === 'Completed') {
        return 'blue-completed--text';
      } else if (status === 'Rewatched') {
        return 'yellow-on-hold--text';
      } else if (status === 'Unfinished') {
        return 'red-dropped--text';
      } else if (status === 'Plan to Watch') {
        return 'grey-plan-to-watch--text';
      }
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
