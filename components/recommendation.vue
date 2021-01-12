<template lang="pug">
v-container.section-border(fluid)
  v-row(align='center')
    v-col(cols='12', lg='2')
      img(:src='recommendation.similar.image')
    v-col(cols='12', lg='10')
      h4.mb-5 {{ recommendation.similar.title }}
      p {{ recommendation.content }}
      v-row
        v-col
          span Recommended by {{ " " }}
          nuxt-link(:to='"/profile/" + recommendation.author.username')
            span.red-netflix--text.ml-1 {{ recommendation.author.username }}
        v-col.text-lg-right
          client-only
            span.small-action.click(
              v-if='$store.state.localStorage.connected && !recommendation.reports.includes($store.state.localStorage.user.id)',
              @click='overlay = true'
            ) report
  report(
    :display='overlay',
    type='recommendation',
    :username='recommendation.author.username',
    :title='recommendation.title.title',
    :confirm='report',
    :cancel='() => (overlay = false)'
  )
</template>
<script>
export default {
  data: () => ({
    overlay: false,
  }),
  props: ['recommendation'],
  methods: {
    report() {
      this.$report('recommendations', this.recommendation.id);
      this.overlay = false;
      this.$store.commit('title/REPORT_RECOMMENDATION', {
        id: this.recommendation.id,
        idUser: this.$store.state.localStorage.user.id,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid $white-font;
}
</style>
