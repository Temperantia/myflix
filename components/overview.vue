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
        v-col
    //-v-col(cols='12', md='3')
      video(:src='title.trailer')
  v-row
    v-col
      h3.title-border OFFICIAL SYNOPSIS
      p.pa-2(v-html='title.synopsis')
  v-row(v-if='title.imdbCast')
    v-col
      h3.title-border CAST
      v-row
        v-col(v-for='actor in title.cast', cols='6', md='2', :key='actor.name')
          v-row
            v-col(cols='3')
              img(:src='actor.image')
            v-col.pl-1.pt-1(cols='9')
              div {{ actor.name }}
              div as
                span.red-netflix--text.pl-2 {{ actor.character }}
              div(v-if='title.summary.type === "show"') {{ actor.episodes }}
  v-row
    v-col
      h3.title-border CREDITS
      v-row
        v-col(
          v-for='(credits, category) in title.credits',
          cols='12',
          md='4',
          :key='category'
        )
          h4.mb-2 {{ category }}
          div(v-for='credit in credits', :key='credit') {{ credit }}
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.getters['title/TITLE'];
    },
  },
};
</script>
