<template lang="pug">
div
  div(style='position: absolute; top: 0; left: 0; z-index: 1')
    img(src='/title bg.png')
    div(style='position: absolute; top: 0; left: 0; padding-left: 20px')
      h2 WHAT'S TRENDING THIS WEEK?
      h4.font-weight-light {{ getWeek() }}
  div(v-swiper='swiperOption', style='height: 600px; z-index: 0')
    .swiper-wrapper
      .swiper-slide(
        v-for='item in trendingWeek',
        :key='item.id',
        style='position: relative; height: 100%'
      )
        div(
          :style='"height: 100%; background-size: cover; background-position: center; background-image: url(" + item.b + ");"'
        )

        div(
          style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
        )
        client-only
          div(
            style='width: 100%; position: absolute; bottom: 0; left: 0; padding: 30px'
          )
            h1 {{ item.t }}
            h2(v-if='item.e', style='padding-top: 10px') Episodes: {{ item.e }}
            b(style='padding-top: 10px') Available on Netflix:
            span {{ " " + availability(item.a) }}
            p(
              style='padding-top: 10px; font-weight: 300',
              v-html='item.d.length < 200 ? item.d : item.d.substring(0, 200) + "..."'
            )
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
import { directive } from 'vue-awesome-swiper'
export default {
   directives: {
    swiper: directive
  },
  data: () => ({
    trendingWeek: [],
    swiperOption: {
      freeMode: true,
      loop: true,
    },
  }),
  created() {
    this.trendingWeek = this.$search
      .filter((title) => title.w)
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 10);
  },
  methods: {
    availability(a) {
      return this.$moment(a).format('D MMM, yyyy').toUpperCase();
    },
    getWeek() {
      const week =
        this.$moment().startOf('isoWeek').format('MMM D').toUpperCase() +
        ' - ' +
        this.$moment().endOf('isoWeek').format('MMM D').toUpperCase();

      return week;
    },
  },
};
</script>
