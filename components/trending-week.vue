<template lang="pug">
v-carousel(:hide-delimiters='true', :hide-delimiters-background='true')
  v-carousel-item(v-for='item in trendingWeek', :key='item.id')
    div(
      :style='"height: 100%;  position: relative; background-size: cover; background-image: url(" + item.storyArt + ");"',
      v-if='item'
    )
      div(style='position: absolute; top: 0; left: 0')
        img(src='/title bg.png')
        div(style='position: absolute; top: 0; left: 0; padding-left: 20px')
          h2 WHAT'S TRENDING THIS WEEK?
          h3 {{ getWeek() }}
      div(
        style="width: 100%;\
                                height: 100%;\
                                      position: absolute;\
                                      bottom: 0;\
                                      left: 0; \
                                      background: linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .7));\
                                      "
      )
      div(
        style="\
                                      width: 100%;\
                                      position: absolute;\
                                      bottom: 0;\
                                      left: 0;\
                                      padding: 30px;\
                                      "
      )
        h1 {{ item.title }}
        h2(v-if='item.episodeCount', style='padding-top: 10px') Episodes: {{ item.episodeCount }}
        h2(style='padding-top: 10px') Available on Netflix: {{ availability(item) }}
        p(style='padding-top: 10px', v-html='item.synopsis')
        div(style='padding-top: 10px')
          button.button.button-red.mr-5
            a(
              :href='"https://www.netflix.com/title/" + item.id',
              style='color: inherit; text-decoration: none'
            )
              | TRAILER
          button.button MORE >
</template>
<script>
export default {
  props: ['trendingWeek'],
  methods: {
    availability(item) {
      return this.$dateFns
        .format(
          new Date(item.availability.availabilityStartTime),
          'd MMM, yyyy'
        )
        .toUpperCase();
    },
    getWeek() {
      const d = new Date();
      const week =
        this.$dateFns
          .format(this.$dateFns.startOfWeek(d, { weekStartsOn: 1 }), 'd MMM')
          .toUpperCase() +
        ' - ' +
        this.$dateFns
          .format(this.$dateFns.endOfWeek(d, { weekStartsOn: 1 }), 'd MMM')
          .toUpperCase();

      return week;
    },
  },
};
</script>
