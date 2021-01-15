<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='12', lg='7')
      h1.title-border TOP UPCOMING PREMIERES OF {{ new Date().getFullYear() }}
      h2.font-weight-light.subtitle.py-5 {{ $dateFns.format(new Date(), "MMMM").toUpperCase() }}
    v-col(cols='5')
  swiper(:options='swiperOption', style='height: 370px')
    swiper-slide(v-for='item in premieres', :key='item.id')
      nuxt-link(:to='item.r')
        div(
          :style='"height: 100%;  position: relative; background-size: cover; background-position: center; background-image: url(" + item.x + ");"'
        )
        div(
          style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
        )
        div(style='position: absolute; bottom: 0; left: 0; padding: 30px')
          .my-5.white-font--text {{ item.g.join(", ") }}
          .my-5(v-html='item.d')
          b.my-5 Coming: {{ $dateFns.format(new Date(item.a), "MMM d, yyyy").toUpperCase() }}
</template>
<script>
export default {
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
