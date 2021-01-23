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
              h2 {{ "Ranked #" + title.rank }}
            v-col(cols='12', lg='4')
              h2 {{ "Popularity #" + title.popularity }}
            v-col(cols='12', lg='4')
              h2 {{ "Following " + title.statistics.Followers }}
          .white-font--text {{ title.releaseYear }} | {{ title.maturity }}
            span.white-font--text(v-if='title.seasonCount') {{ " | " + title.seasonCount + (title.seasonCount > 1 ? " Seasons" : " Season") }}
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
                v-model='status',
                dense,
                placeholder='Change status',
                :hide-details='true',
                @change='updateStatus'
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
                  v-model='episodes',
                  @input='updateEpisodes'
                )
                span.ml-1 {{ " / " + title.episodeCount }}
        v-col(cols='12', lg='4')
          client-only
            v-select(
              :items='Object.entries($ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
              outlined,
              v-model='score',
              dense,
              placeholder='Rate this title',
              :hide-details='true',
              @change='saved = false'
            )
        v-col(cols='12', lg='4')
          v-btn(color='blue-completed', @click='vpn = true') GET IT IN YOUR COUNTRY
      v-row.my-1
        v-col
          v-btn.mr-3(
            color='black-search',
            @click='bingeworthy = !bingeworthy; saved = false'
          )
            v-icon(
              :class='bingeworthy ? "green-watching--text" : "greyButton--text"',
              left
            ) mdi-check
            span.font-weight-light(
              :class='bingeworthy ? "white--text" : "white-font--text"'
            ) Would you binge-watch this series?
          button.mr-3.button.white--text(@click='update')
            v-icon(color='green-watching', v-if='saved') mdi-check
            span(v-else) UPDATE
          v-btn(color='black-search')
            v-icon mdi-share-variant
            span Share this page
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
  v-row(v-if='title.imdbCast')
    v-col
      h3.title-border CAST
      v-container(fluid)
        v-row
          v-col(
            v-if='title.cast',
            v-for='actor in title.cast',
            cols='6',
            md='2',
            :key='actor.name'
          )
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
          v-col(
            v-if='title.credits',
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
<script>
export default {
  data: () => ({
    expanded: {},
    vpn: false,
    bingeworthy: false,
    status: '',
    episodes: 0,
    score: '',
    saved: false,
  }),
  mounted() {
    if (this.title.credits) {
      for (const category in this.title.credits) {
        this.expanded[category] = false;
      }
    }
  },
  created() {
    if (this.flixlist) {
      if (this.flixlist.status) {
        this.status = this.flixlist.status;
      }
      if (this.flixlist.episodes) {
        this.episodes = this.flixlist.episodes;
      }
      if (this.flixlist.score) {
        this.score = `${this.flixlist.score} - ${
          this.$ratings[this.flixlist.score]
        }`;
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters['localStorage/USER'];
    },
    flixlist() {
      return this.user ? this.user.flixlist[this.title.id] : null;
    },
    title() {
      return this.$store.getters['title/TITLE'];
    },
    statuses() {
      const statuses = this.$statusesTvShow;
      return [...statuses, 'Remove from List'];
    },
  },
  methods: {
    async update() {
      if (
        !this.saved &&
        (await this.$updateFlixlist(
          this.title,
          this.status,
          Number(this.episodes),
          this.score ? Number(this.score.split('-')[0]) : null,
          this.bingeworthy
        ))
      ) {
        this.saved = true;
      }
    },
    updateStatus(value) {
      if (value === 'Remove from List') {
        this.status = '';
        return;
      }
      if (this.title.summary.type === 'show') {
        if (this.status === 'Completed') {
          this.episodes = this.title.episodeCount;
        } else if (!this.status || this.episodes === this.title.episodeCount) {
          this.episodes = 0;
        }
      }
      this.saved = false;
    },
    updateEpisodes(event) {
      const value = event.target.value;
      if (value <= 0) {
        this.episodes = 0;
        this.status = '';
      } else if (value >= this.title.episodeCount) {
        this.episodes = this.title.episodeCount;
        this.status = 'Completed';
      } else {
        if (this.status === 'Completed' || !this.status) {
          this.status = 'Watching';
        }
      }
      this.saved = false;
    },
  },
};
</script>
