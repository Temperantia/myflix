<template lang="pug">
div
  div(style='position: absolute; top: 0; left: 0; z-index: 1')
    img(src='/title bg.png')
    div(style='position: absolute; top: 0; left: 0; padding-left: 1vw')
      h2.font-weight-bold {{ isNewReleases ? "TRENDING NEW RELEASES" : "WHAT'S TRENDING THIS WEEK?" }}
      h4.font-weight-light {{ getWeek() }}
  swiper(:options='swiperOption', style='height: 600px; z-index: 0')
    swiper-slide(
      v-for='title in trendingWeek(isNewReleases)',
      :key='title.id',
      style='position: relative; height: 100%'
    )
      div(
        :title='title.t',
        :style='"height: 100%; background-size: cover; background-position: center; background-image: url(" + title.b + ");"'
      )

      div(
        style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
      )
      client-only
        div(
          style='width: 100%; position: absolute; bottom: 0; left: 0; padding: 1.5vw'
        )
          h1.mb-1 {{ title.t }}
          h2(v-if='title.e', style='padding-top: 10px') Episodes: {{ title.e }}
          span.font-weight-bold(style='padding-top: 10px') Available on Netflix: {{ " " + availability(title.a) }}
          p(
            style='padding-top: 10px; font-weight: 300',
            v-html='title.d.length < 200 ? title.d : title.d.substring(0, 200) + "..."'
          )
          div(style='padding-top: 10px')
            button.button.button-red.mr-5
              a(
                :href='"https://www.netflix.com/title/" + title.id',
                style='color: inherit; text-decoration: none'
              )
                | TRAILER
            nuxt-link(:to='title.r')
              button.button MORE >
</template>
<script lang='ts'>
import { Swiper as SwiperClass, Autoplay } from 'swiper/swiper.esm';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';

SwiperClass.use([Autoplay]);
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);
const browseModule = namespace('browse');

import 'swiper/swiper-bundle.css';

@Component({ components: { Swiper, SwiperSlide } })
export default class TrendingWeek extends Vue {
  @Prop({ type: Boolean }) isNewReleases!: boolean;

  @browseModule.Getter('trendingWeek') trendingWeek!: any;

  swiperOption = {
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    loop: true,
  };

  availability(a: number) {
    return this.$moment(a).format('D MMM, yyyy').toUpperCase();
  }

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
  }
}
</script>
