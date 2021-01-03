<template lang="pug">
v-container(fluid)
  v-row.subtitle-border
    v-col(cols='3')
      h1 {{ show ? "TV SHOWS" : "FILMS" }}
    v-col(cols='5')
      input#search.border.white-font--border(
        v-model='search',
        :placeholder='"SEARCH " + (show ? "TV SHOWS" : "FILMS")'
      )
    v-col.text-right(cols='4')
      a
        img.icon(@click='settings = !settings', src='/gear.png')
      .window.pa-2.border.white-font--border(v-if='settings')
        v-checkbox.my-1(
          label='Show completed',
          v-model='completed',
          dense,
          hide-details,
          v-if='flixlist'
        )
        v-checkbox.my-1(
          label='Show currently watching',
          v-model='watching',
          dense,
          hide-details,
          v-if='show && flixlist'
        )
        v-checkbox.my-1(
          label='Netflix Original only',
          v-model='original',
          dense,
          hide-details,
          v-if='show'
        )
  v-row
    v-col(cols='2')
      | Genre
      v-select(
        :items='["All", ...categories]',
        v-model='category',
        outlined,
        dense
      )
    v-col(cols='2')
      | Rating
      v-select(
        :items='["All", ...Object.values($maturities)]',
        v-model='maturity',
        outlined,
        dense
      )
    v-col(cols='2')
      | Sort
      v-select(
        :items='["Netflix Original", "Release date (Newest first)", "Release date (Oldest first)", "Alphabetical (A - Z)"]',
        v-model='sort',
        outlined,
        dense
      )
  client-only(v-if='pages > 1')
    v-row(justify='center')
      v-col
        v-pagination(:length='pages', v-model='page', :total-visible='25')
  v-row.subtitle-border(v-for='title in titles', :key='title.id')
    v-col(cols='1')
      img(:src='title.i')
    v-col(cols='11')
      .d-flex.align-center
        nuxt-link(:to='title.r')
          h2.mr-5 {{ title.t }}
        span.d-flex.align-center(v-if='title.o')
          img.icon.mr-3(src='/netflix.png')
          span.white-font--text O R I G I N A L
      .my-1
        span.white-font--text.mr-2 {{ title.y }}
        span.white-font--text.mr-1.py-1.px-2.border.white-font--border {{ title.m }}
        span.white-font--text.mr-1 {{ title.s ? title.s : 1 }} SEASON
        b(v-if='user')
          i.green-watching--text(v-if='title.status === "Watching"') {{ title.episodes }}
            span {{ " / " + title.e }}
          i(
            v-else,
            :class='textColor(title.u ? "show" : "movie", title.status)'
          ) {{ title.status }}
      .my-1 {{ title.d }}
      div
        span Genres:
        span.white-font--text {{ " " + title.g.join(", ") }}
      .mt-3(v-if='user && title.status')
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
import categories from '~/netflix/data/categories';
export default {
  props: ['show'],
  data: () => ({
    settings: false,
    page: 1,
    category: 'All',
    maturity: 'All',
    sort: 'Alphabetical (A - Z)',
    completed: false,
    watching: false,
    original: false,
    search: '',
    categories,
    now: Date.now(),
    nowYear: new Date().getFullYear(),
  }),
  computed: {
    user() {
      return this.$store.state.localStorage.user;
    },
    flixlist() {
      if (this.user) {
        return this.user.flixlist;
      }
    },
    source() {
      return this.$search
        .filter((title) => {
          if (title.y === 0 || title.a > this.now || title.y > this.nowYear) {
            return false;
          }
          return (
            (this.show ? title.u : !title.u) &&
            (this.category === 'All' || title.c.includes(this.category)) &&
            (this.maturity === 'All' || title.m === this.maturity) &&
            (this.search === '' || title.t.startsWith(this.search)) &&
            (!this.original || title.o) &&
            (((!this.completed || title.status === 'Completed') &&
              (!this.watching || title.status === 'Watching')) ||
              (this.completed &&
                this.watching &&
                (title.status === 'Completed' || title.status === 'Watching')))
          );
        })
        .map((title) => {
          if (this.flixlist && this.flixlist[title.id]) {
            title.status = this.flixlist[title.id].status;
            if (title.s) {
              title.episodes = this.flixlist[title.id].episodes;
            }
          }

          return title;
        })
        .sort((a, b) => {
          if (this.sort === 'Netflix Original') {
            return a.o ? -1 : 1;
          } else if (this.sort === 'Release date (Newest first)') {
            return a.a && b.a ? (a.a > b.a ? -1 : 1) : a.y > b.y ? -1 : 1;
          } else if (this.sort === 'Release date (Oldest first)') {
            return a.a && b.a ? (a.a < b.a ? -1 : 1) : a.y < b.y ? -1 : 1;
          }
        });
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
<style lang="scss" scoped>
.icon {
  width: auto;
}
.window {
  position: absolute;
  top: 0;
  right: 50px;
  background-color: $black-body;
}
</style>
