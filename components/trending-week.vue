<template lang="pug">
v-carousel(:hide-delimiters='true', :hide-delimiters-background='true')
  v-carousel-item(v-for='item in trendingWeek', :key='item.id')
    div(
      :style='"height: 100%; background-size: cover; background-image: url(" + item.b + ");"'
    )
    div(style='position: absolute; top: 0; left: 0')
      img(src='/title bg.png')
      div(style='position: absolute; top: 0; left: 0; padding-left: 20px')
        h2 WHAT'S TRENDING THIS WEEK?
        h3 {{ getWeek() }}
    div(
      style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
    )
    div(
      style='width: 100%; position: absolute; bottom: 0; left: 0; padding: 30px'
    )
      h1 {{ item.t }}
      h2(v-if='item.e', style='padding-top: 10px') Episodes: {{ item.e }}
      h2(style='padding-top: 10px') Available on Netflix: {{ availability(item.a) }}
      p(style='padding-top: 10px', v-html='item.d')
      div(style='padding-top: 10px')
        button.button.button-red.mr-5
          a(
            :href='"https://www.netflix.com/title/" + item.id',
            style='color: inherit; text-decoration: none'
          )
            | TRAILER
        nuxt-link(:to='item.r')
          button.button MORE >
</template>
<script>
export default {
  data: () => ({
    trendingWeek: [],
  }),
  mounted() {
    this.trendingWeek = this.$search
      .filter((title) => title.w)
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 10);
  },
  methods: {
    availability(a) {
      return this.$dateFns.format(new Date(a), 'd MMM, yyyy').toUpperCase();
    },
    getWeek() {
      const d = new Date();
      const week =
        this.$dateFns
          .format(this.$dateFns.startOfWeek(d, { weekStartsOn: 1 }), 'MMM d')
          .toUpperCase() +
        ' - ' +
        this.$dateFns
          .format(this.$dateFns.endOfWeek(d, { weekStartsOn: 1 }), 'MMM d')
          .toUpperCase();

      return week;
    },
  },
};
</script>
