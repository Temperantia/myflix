<template lang="pug">
v-container(fluid)
  v-row(v-if='gallery')
    v-col.click.pa-0.item-wrap(
      v-for='title in titles',
      :key='title.id',
      cols='12',
      lg='4',
      style='position: relative; height: 300px'
    )
      nuxt-link(:to='title.r')
        div(
          v-if='title.status',
          style='width: 100%; position: absolute; top: 0; left: 0'
        )
          progress-bar(
            :status='title.status',
            :episodes='episodes',
            :episodeCount='title.e'
          )
        div(
          :style='"width: 100%; height: 100%; background-size: cover; background-position: center; background-image: url(" + title.b + ");"'
        )
        .gradient
          .hover-title
            .mb-2
              h2.d-inline.font-weight-regular {{ title.t }}
              b.ml-2(v-if='connected')
                i.green-watching--text(v-if='title.status === "Watching"') {{ title.episodes }}
                  span {{ " / " + title.e }}
                i(
                  v-else,
                  :class='textColor(title.u ? "show" : "movie", title.status)'
                ) {{ title.status }}
              //-v-icon.click.fave(
                v-if='isFavorite(title.id)',
                @click='removeFavoriteFromId(title.id)'
                ) mdi-star
              //-v-icon.click.fave(v-else, @click='addFavoriteFromId(title.id)') mdi-star-outline
          .hover-item
            .mb-2
              span.white-font--text {{ title.y + " " }}
              span.py-0.px-1.white-font--text.white-font--border.border {{ title.v }}
              span.white-font--text(v-if='title.s') {{ " " + title.s + " SEASONS" }}
            .mb-2.titleDetails(
              v-html='title.d.length < 100 ? title.d : title.d.substring(0, 100) + "..."'
            )
            .titleDetails
              span {{ "Genres: " }}
              span.white-font--text {{ title.g.join(", ") }}
  v-row.subtitle-border(v-else, v-for='title in titles', :key='title.id')
    v-col(cols='12', lg='1')
      v-container(fluid)
        v-row
          v-col
            img(:src='title.i')
    v-col(cols='12', lg='11')
      v-container(fluid)
        v-row(v-if='$vuetify.breakpoint.smAndDown')
          v-col(cols='12')
            nuxt-link(:to='title.r')
              h2.mr-5 {{ title.t }}
          v-col.d-flex.align-center(v-if='title.o', cols='12')
            img.icon.mr-3(src='/netflix.png')
            span.white-font--text O R I G I N A L
        v-row(v-else, align='center')
          v-col(cols='8')
            nuxt-link(:to='title.r')
              h2.d-inline.mr-5 {{ title.t }}
            .d-inline-flex.align-center.justify-space-between(v-if='title.o')
              img.icon.mr-3(src='/netflix.png')
              span.white-font--text O R I G I N A L
          v-col.text-right(cols='4')
            //-client-only(v-if='favorites')
              .click(
                v-if='isFavorite(title.id)',
                @click='removeFavoriteFromId(title.id)'
              )
                v-icon mdi-star
                span In Favorites
              .click(v-else, @click='addFavoriteFromId(title.id)')
                v-icon mdi-star-outline
                span Add to Favorites
        .my-1
          span.white-font--text.mr-2 {{ title.y }}
          span.white-font--text.mr-1.py-0.px-1.border.white-font--border {{ title.v }}
          span.white-font--text.mr-1(v-if='title.s') {{ title.s }} SEASONS
          b(v-if='connected')
            i.green-watching--text(v-if='title.status === "Watching"') {{ title.episodes }}
              span {{ " / " + title.e }}
            i(
              v-else,
              :class='$titleStatusColor(title.u ? "show" : "movie", title.status)'
            ) {{ title.status }}
        .my-1(v-html='title.d')
        div
          span Genres:
          span.white-font--text {{ " " + title.g.join(", ") }}
        .mt-3(v-if='connected && title.status')
          progress-bar(
            :status='title.status',
            :episodes='title.episodes',
            :episodeCount='title.e',
            :width='200'
          )
  client-only(v-if='pages > 1')
    v-row.pagination(justify='center')
      v-col
        v-pagination(:length='pages', v-model='page', :total-visible='7')
</template>
<script lang='ts'>
import { Vue, Component, namespace, Prop } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');

@Component
export default class Search extends Vue {
  @Prop({ type: Object }) source!: any;
  @Prop({ type: Boolean }) galley!: boolean;
  @localStorageModule.State('connected') connected!: boolean;

  page = 1;
  get pages() {
    return Math.ceil(this.source.length / 24);
  }
  get titles() {
    const offset = (this.page - 1) * 24;
    return this.source.slice(offset, offset + 24);
  }
}
</script>
<style lang="scss" scoped>
.titleDetails {
  line-height: 18px;
  padding-top: 5px;
}
.subtitle-border {
  margin: 0px;
}
.pagination {
  margin-top: 12px;
}
.item-wrap {
  overflow: hidden;
  position: relative;
  font-weight: 400;

  &:hover .hover-item {
    bottom: 0px;
    opacity: 1;
  }

  &:hover .hover-title {
    bottom: 100px;
  }
}
.hover-title {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 22px;
  -o-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.hover-item {
  width: 100%;
  max-height: 300px;
  position: absolute;
  padding: 22px;
  bottom: -100px;
  opacity: 0;
  -o-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.gradient {
  display: block;
  border-top: 4px;
  width: 100%;
  height: 300px;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
}
.fave {
  position: absolute;
  right: 22px;
  top: 32px;
  font-size: 18px;
}
</style>