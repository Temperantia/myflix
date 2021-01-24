<template lang="pug">
v-container.section-border(fluid)
  v-row(align='center')
    v-col(cols='12', lg='2')
      img(:src='suggestion.similar.image')
    v-col(cols='12', lg='10')
      h4.mb-5 {{ suggestion.similar.title }}
      p {{ suggestion.content }}
      v-row
        v-col
          span Suggested by {{ " " }}
          nuxt-link(:to='"/profile/" + suggestion.author.username')
            span.red-netflix--text.ml-1 {{ suggestion.author.username }}
        v-col.text-lg-right
          client-only
            span.small-action.click(
              v-if='$store.state.localStorage.connected && !$store.getters["profile/SELF"] && !suggestion.reports.includes($store.state.localStorage.user.id)',
              @click='overlay = true'
            ) report
  report(
    :display='overlay',
    type='suggestion',
    :username='suggestion.author.username',
    :title='suggestion.title.title',
    :confirm='report',
    :cancel='() => (overlay = false)'
  )
</template>
<script>
export default {
  data: () => ({
    overlay: false,
  }),
  props: ['suggestion'],
  methods: {
    report() {
      this.$report('suggestions', this.suggestion.id);
      this.overlay = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid $white-font;
}
</style>
