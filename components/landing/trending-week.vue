<template lang="pug">
div
  div(style='position: absolute; top: 0; left: 0; z-index: 1')
    img(src='/title bg.png')
    div(style='position: absolute; top: 0; left: 0; padding-left: 10px')
      h2.font-weight-bold.pt-1 {{ isNewReleases ? "TRENDING NEW RELEASES" : "WHAT'S TRENDING THIS WEEK?" }}
      h4.font-weight-light {{ getWeek() }}
  swiper(:options='swiperOption', style='height: 600px; z-index: 0')
    swiper-slide(
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
          h1.mb-1 {{ item.t }}
          h2(v-if='item.e', style='padding-top: 10px') Episodes: {{ item.e }}
          span.font-weight-bold(style='padding-top: 10px') Available on Netflix: {{ " " + availability(item.a) }}
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
import { Swiper as SwiperClass, Autoplay } from 'swiper/swiper.esm';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
SwiperClass.use([Autoplay]);

const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);
import 'swiper/swiper-bundle.css';

export default {
  props: { isNewReleases: Boolean },
  components: { Swiper, SwiperSlide },
  data: () => ({
    trendingWeek: [],
    swiperOption: {
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      loop: true,
    },
  }),
  created() {
    this.trendingWeek = this.$search
      .filter((title) => (this.isNewReleases ? title.n : title.w))
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 10);
  },
  methods: {
    availability(a) {
      return this.$moment(a).format('D MMM, yyyy').toUpperCase();
    },
    getWeek() {
      let start = this.$moment().startOf('isoWeek');
      if (this.isNewReleases) {
        start = start.subtract(7, 'days');
      }

      const week =
        start.format('MMM D').toUpperCase() +
        ' - ' +
        this.$moment().endOf('isoWeek').format('MMM D').toUpperCase();

      return week;
    },
  },
};
</script>
