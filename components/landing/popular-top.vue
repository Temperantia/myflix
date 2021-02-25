<template lang="pug">
v-col(cols='12', md='7')
  h1.title-border.font-weight-bold TOP 5 MOST POPULAR ONGOING SERIES
  h2.font-weight-regular.subtitle.py-3 {{ $moment().format("MMM D, yyyy").toUpperCase() }}
  v-container(fluid)
    v-row.my-2.top5List(v-for='(title, index) in topSeries', :key='title.id')
      v-col.text-center(cols='1')
        h1.font-weight-black {{ index + 1 }}
      v-col(cols='11', md='3')
        nuxt-link(:to='title.r')
          img(:src='title.b' :alt='title.t')
      v-col(offset='1', cols='11', offset-md='0', :md='connected ? "5" : "8"')
        nuxt-link(:to='title.r')
          h2 {{ title.t }}
        i
          span {{ title.s + " seasons" }}
          span(v-if='title.e') {{ ", " + title.e + " episodes" }}
        div
          span {{ "Score " }}
          span.red-netflix--text {{ title.z + "/10" }}
        div Released {{ title.a ? $moment(title.a).format("MMM D, yyyy") : "-" }}
        div
          span.red-netflix--text {{ title.f + " members " }}
          span watching this
      v-col(cols='12', md='3', v-if='connected')
        flixlist-add(:title='title')
</template>
<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const browseModule = namespace('browse');
const localStorageModule = namespace('localStorage');

@Component
export default class PopularTop extends Vue {
  @localStorageModule.State('connected') connected!: boolean;
  @browseModule.Getter('topSeries') topSeries!: any;
}
</script>
<style lang="scss" scoped>
.top5List {
  border-bottom: 1px $grey-google solid;

  .click {
    text-align: right;

    .v-icon {
      font-size: 16px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
