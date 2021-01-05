<template lang="pug">
v-container(v-if='edition', fluid)
  v-row.mt-5.title-border
    v-col(cols='10')
      h3 {{ title.title.toUpperCase() }}
    v-col(cols='2')
      h4.text-right {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " RECOMMENDATION" }}
  v-row.section-border
    v-col(cols='10')
      h4 Choose a similar {{ title.summary.type === "show" ? "TV Show" : "Film" }} title
      search(
        :title='recommendation.similar',
        @click='(title, image, route) => (recommendation.similar = { title, image, route })'
      )
    v-col.text-right(cols='2')
      button.red-netflix--text(@click='edition = false') CANCEL
  v-row.section-border.py-5
    v-col(cols='12')
      h4 How is this similar to {{ title.title }}?
    v-col(cols='12')
      textarea(v-model='recommendation.content')
      .white-font--text Tip: Don't recommend sequels or other related film/series
    v-col.text-right(cols='12')
      button.button-action(@click='submit') SUBMIT RECOMMENDATION
  v-row
    v-col
      h4 Recommendation Tips and Guidelines
      p
        .white-font--text - Recommendations should contain persuasive arguments based on opinion and not solely on fact.
        .white-font--text - No spoilers.
        .white-font--text - All recommendations are public.
v-container(v-else, fluid)
  v-row.mt-5.title-border
    v-col(cols='8')
      h3 RECOMMENDATIONS
    v-col.text-right(cols='4')
      client-only
        button(v-if='$store.state.localStorage.connected', @click='edition = true') MAKE A RECOMMENDATION
        div(v-else) SIGN IN TO MAKE A RECOMMENDATION
  recommendation(
    :recommendation='recommendation',
    v-for='recommendation in recommendations',
    :key='recommendation.id'
  )
</template>
<script>
export default {
  data: () => ({
    edition: false,
    recommendation: {
      content: '',
      similar: null,
    },
  }),
  methods: {
    submit() {
      if (
        this.recommendation.content.length < 200 ||
        this.recommendation.content.length > 1000
      ) {
        this.$toasted.error(
          'Your recommendation needs between 200 and 1000 characters.'
        );
        return;
      }
      if (!this.recommendation.similar) {
        this.$toasted.error('You need to pick a similar title');
        return;
      }
      this.$createRecommendation(
        this.title,
        this.recommendation,
        this.$store.state.localStorage.user
      );
      this.edition = false;
      this.$forceUpdate();
    },
  },
  computed: {
    title() {
      return this.$store.state.title.data;
    },
    recommendations() {
      return this.$store.state.title.recommendations;
    },
  },
};
</script>
<style lang="scss" scoped>
.section-border {
  border-bottom: 1px solid $white-font;
}
input {
  padding-left: 5px;
  color: white;
  border: 1px solid white;
  width: 50px;
  border-radius: 5px;
}
.button-action {
  padding: 5px 20px;
  border-radius: 5px;
  border: 1px solid white;
}
textarea {
  background-color: $black-subheader;
  width: 100%;
  height: 200px;
  padding: 10px;
  border-radius: 5px;
  resize: none;
}
</style>
