<template lang="pug">
v-container.section-border(fluid, :id='"suggestion-" + suggestion.id')
  v-row(align='center')
    v-col(cols='12', lg='2')
      img(:src='suggestion.similar.Poster')
    v-col(cols='12', lg='10')
      v-container(fluid)
        v-row
          v-col
            h4.mb-5 {{ suggestion.similar.title }}
          v-col.text-lg-right
            client-only
              span.white-font--text.click(
                @click='$copyText($config.baseUrl + $route.path + "#suggestion-" + suggestion.id); $toast.success("Copied to clipboard")'
              ) permalink
              span.white-font--text {{ " | " }}
              share(
                :url='$config.baseUrl + $route.path + "#suggestion-" + suggestion.id'
              )
              template(
                v-if='connected && !self && !suggestion.reports.includes(id)'
              )
                span.white-font--text {{ " | " }}
                span.white-font--text.click(@click='overlay = true') report
      v-container(fluid)
        v-row
          v-col
            p {{ suggestion.content }}
      v-container(fluid)
        v-row
          v-col
            span Suggested by {{ " " }}
            nuxt-link(:to='"/profile/" + suggestion.author.username')
              span.red-netflix--text.ml-1 {{ suggestion.author.username }}
  report(
    :display='overlay',
    type='suggestion',
    :username='suggestion.author.username',
    :title='suggestion.title.title',
    :confirm='check',
    :cancel='() => (overlay = false)'
  )
</template>
<script lang='ts'>
import { Vue, Component, Prop, namespace } from 'nuxt-property-decorator';

const suggestionsModule = namespace('reviews');
const localStorageModule = namespace('localStorage');
const profileModule = namespace('profile');

@Component
export default class Suggestion extends Vue {
  @Prop({ type: Object }) suggestion!: any;

  @localStorageModule.State('connected') connected!: boolean;
  @localStorageModule.Getter('id') id!: string;
  @profileModule.Getter('self') self!: boolean;
  @suggestionsModule.Action('report') report!: any;

  overlay = false;

  check() {
    this.report(this.suggestion);
    this.overlay = false;
  }
}
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid $white-font;
}
</style>
