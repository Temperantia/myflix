<template lang="pug">
v-container.px-10(fluid)
  v-row
    v-col(cols='12', lg='7')
      h1.title-border.font-weight-bold TOP UPCOMING PREMIERES OF {{ new Date().getFullYear() }}
      h2.font-weight-light.subtitle.py-5 {{ $moment().format("MMMM").toUpperCase() }}
    v-col(cols='5')
  div(v-swiper='swiperOption', style='height: 370px')
    .swiper-wrapper
      .swiper-slide(v-for='item in premieres', :key='item.id')
        nuxt-link(:to='item.r')
          div(
            :style='"height: 100%;  position: relative; background-size: cover; background-position: center; background-image: url(" + item.b + ");"'
          )
          div(
            style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
          )
          div(style='position: absolute; bottom: 0; left: 0; padding: 30px')
            h2 {{ item.t }}
            .my-5.white-font--text {{ item.g.join(", ") }}
            .my-5(
              v-html='item.d.length < 200 ? item.d : item.d.substring(0, 200) + "..."'
            )
            b.my-5 Coming: {{ $moment(item.a).format("MMM D, yyyy").toUpperCase() }}
</template>
<script>
import { directive } from 'vue-awesome-swiper';

export default {
  directives: {
    swiper: directive,
  },
  data: () => ({
    swiperOption: {
      freeMode: true,
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
    },
  }),
  computed: {
    premieres() {
      return this.$search
        .filter((title) => title.m)
        .sort((a, b) => (a.p < b.p ? -1 : 1))
        .slice(0, 10);
    },
  },
};
</script>
