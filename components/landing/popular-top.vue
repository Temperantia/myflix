<template lang="pug">
v-col(cols='12', lg='7')
  h1.title-border.font-weight-bold TOP 5 MOST POPULAR ONGOING SERIES
  h2.font-weight-regular.subtitle.py-3 {{ $moment().format("MMM D, yyyy").toUpperCase() }}
  v-container(fluid)
    v-row.my-2.top5List(v-for='(item, index) in topSeries', :key='item.id')
      v-col.text-center(cols='1')
        h1.font-weight-black {{ index + 1 }}
      v-col(cols='11', lg='3')
        nuxt-link(:to='item.r')
          img(:src='item.i')
      v-col(offset='1', cols='11', offset-lg='0', :lg='false ? "5" : "8"')
        nuxt-link(:to='item.r')
          h2 {{ item.t }}
        i
          span {{ item.s + " seasons" }}
          span(v-if='item.e') {{ ", " + item.e + " episodes" }}
        div
          span {{ "Score " }}
          span.red-netflix--text {{ item.z + "/10" }}
        div Released {{ item.a ? $moment(item.a).format("MMM D, yyyy") : "-" }}
        div
          span.red-netflix--text {{ item.f + " members " }}
          span watching this
      //-v-col(cols='12', md='3', v-if='favorites')
        client-only
          .click(
            v-if='isFavorite(item.id)',
            @click='removeFavoriteFromId(item.id)'
          )
            v-icon.mr-2 mdi-star
            span In Favorites
          .click(v-else, @click='addFavoriteFromId(item.id)')
            v-icon.mr-2 mdi-star-outline
            span Add to Favorites
</template>
<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const browseModule = namespace('browse');

@Component
export default class PopularTop extends Vue {
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
