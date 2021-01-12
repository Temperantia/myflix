<template lang="pug">
v-container(fluid)
  client-only(v-if='pages > 1')
    v-row(justify='center')
      v-col
        v-pagination(:length='pages', v-model='page', :total-visible='25')
  v-row.subtitle-border(v-for='title in titles', :key='title.id')
    v-col(cols='12', lg='1')
      img(:src='title.i')
    v-col(cols='12', lg='11')
      v-row(align='center')
        v-col(cols='12', lg='9')
          nuxt-link(:to='title.r')
            h2.mr-5 {{ title.t }}
        v-col.d-flex.align-center(v-if='title.o', cols='12', lg='3')
          img.icon.mr-3(src='/netflix.png')
          span.white-font--text O R I G I N A L
      .my-1
        span.white-font--text.mr-2 {{ title.y }}
        span.white-font--text.mr-1.py-1.px-2.border.white-font--border {{ $maturities[title.v] }}
        span.white-font--text.mr-1 {{ title.s ? title.s : 1 }} SEASON
        b(v-if='flixlist')
          i.green-watching--text(v-if='title.status === "Watching"') {{ title.episodes }}
            span {{ " / " + title.e }}
          i(
            v-else,
            :class='textColor(title.u ? "show" : "movie", title.status)'
          ) {{ title.status }}
      .my-1(v-html='title.d')
      div
        span Genres:
        span.white-font--text {{ " " + title.g.join(", ") }}
      .mt-3(v-if='flixlist && title.status')
        progress-bar(
          :status='title.status',
          :episodes='title.episodes',
          :episodeCount='title.e'
        )
  client-only(v-if='pages > 1')
    v-row(justify='center')
      v-col
        v-pagination(:length='pages', v-model='page', :total-visible='25')
</template>
<script>
export default {
  props: ['source'],
  data: () => ({ page: 1 }),
  computed: {
    flixlist() {
      if (this.$store.state.localStorage.user) {
        return this.$store.state.localStorage.user.flixlist;
      }
    },
    pages() {
      return parseInt(this.source.length / 25);
    },
    titles() {
      const offset = (this.page - 1) * 25;
      return this.source.slice(offset, offset + 25);
    },
  },
  methods: {
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
