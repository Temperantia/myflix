<template lang="pug">
v-container.px-10(fluid)
  v-row
    v-col(cols='12', lg='7')
      h1.title-border.font-weight-bold TOP UPCOMING PREMIERES OF {{ new Date().getFullYear() }}
      h2.font-weight-light.subtitle.py-5 {{ $moment().format("MMMM").toUpperCase() }}
    v-col(cols='5')
  div(v-swiper='swiperOption', style='height: 370px')
    .swiper-wrapper
      .swiper-slide(v-for='title in premieres', :key='title.id')
        nuxt-link(:to='title.r')
          div(
            :style='"height: 100%;  position: relative; background-size: cover; background-position: center; background-image: url(" + title.b + ");"'
          )
          div(
            style='width: 100%; height: 100%; position: absolute; bottom: 0; left: 0; background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
          )
          div(style='position: absolute; bottom: 0; left: 0; padding: 1vw')
            h2 {{ title.t }}
            .my-5.white-font--text {{ title.g.join(", ") }}
            .my-5(
              v-html='title.d.length < 200 ? title.d : title.d.substring(0, 200) + "..."'
            )
            b.my-5 Coming: {{ $moment(title.a).format("MMM D, yyyy").toUpperCase() }}
</template>
<script lang='ts'>
import { directive } from 'vue-awesome-swiper';
import { Vue, Component, namespace } from 'nuxt-property-decorator';
const browseModule = namespace('browse');

@Component({ directives: { swiper: directive } })
export default class Premieres extends Vue {
  @browseModule.Getter('premieres') premieres!: any;
  swiperOption = {
    freeMode: true,
    loop: true,
    slidesPerView: this.$vuetify.breakpoint.mdAndUp ? 3 : 1,
    spaceBetween: 30,
  };
}
</script>
