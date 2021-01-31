<template lang="pug">
v-container(v-if='edition', fluid)
  v-row.mt-5.title-border
    v-col(cols='12', lg='10')
      h3 {{ title.title.toUpperCase() }}
    v-col.text-lg-right(cols='12', lg='2')
      h4 {{ title.summary.type === "show" ? "TV SHOW" : "FILM" + " SUGGESTION" }}
  v-row.section-border
    v-col(cols='12', lg='10')
      h4 Choose a similar {{ title.summary.type === "show" ? "TV Show" : "Film" }} title
      search(
        :title='suggestion.similar',
        @click='(id, title, image, route) => (suggestion.similar = { id, title, image, route })'
      )
    v-col.text-lg-right(cols='12', lg='2')
      button.red-netflix--text(@click='edition = false') CANCEL
  v-row.section-border.py-5
    v-col(cols='12')
      h4 How is this similar to {{ title.title }}?
    v-col(cols='12')
      textarea(v-model='suggestion.content')
      .white-font--text Tip: Don't suggest sequels or other related film/series
    v-col.text-lg-right(cols='12')
      button.button-action(@click='submit') SUBMIT SUGGESTION
  v-row
    v-col
      h4 Suggestion Tips and Guidelines
      p
        .white-font--text - Suggestions should contain persuasive arguments based on opinion and not solely on fact.
        .white-font--text - No spoilers.
        .white-font--text - All suggestions are public.
div(v-else)
  v-container(fluid)
    v-row.title-border
      v-col(cols='12', lg='8')
        h3 SUGGESTIONS
      v-col.text-lg-right(cols='12', lg='4')
        client-only
          button(
            v-if='$store.state.localStorage.connected',
            @click='edition = true'
          ) MAKE A SUGGESTION
          button(v-else, @click='$router.push("/sign-in")') SIGN IN TO MAKE A SUGGESTION
  template(v-if='suggestions.length > 0')
    suggestion(
      :suggestion='suggestion',
      v-for='suggestion in suggestions',
      :key='suggestion.id'
    )
    client-only(v-if='pages > 1')
      v-container(fluid)
        v-row.ma-0(justify='center')
          v-col
            v-pagination(:length='pages', v-model='page', :total-visible='7')
  v-container(v-else, fluid)
    v-row
      v-col
        p No suggestions yet
</template>
<script>
export default {
  data: () => ({
    suggestionsPerPage: 20,
    page: 1,
    edition: false,
    suggestion: {
      content: '',
      similar: null,
    },
  }),
  mounted() {
    const id = this.$route.hash.substring(1);
    if (id) {
      const index = this.source.findIndex((suggestion) => suggestion.id === id);
      if (index !== -1) {
        this.page = Math.floor(index / this.suggestionsPerPage) + 1;
        const checkExist = setInterval(() => {
          if (document.getElementById(id)) {
            this.$scrollTo('#suggestion-' + id);
            clearInterval(checkExist);
          }
        }, 100);
      }
    }
  },
  methods: {
    submit() {
      if (
        this.suggestion.content.length < 200 ||
        this.suggestion.content.length > 1000
      ) {
        this.$toast.error(
          'Your suggestion needs between 200 and 1000 characters.'
        );
        return;
      }
      if (!this.suggestion.similar) {
        this.$toast.error('You need to pick a similar title');
        return;
      }
      this.$createSuggestion(
        this.title,
        this.suggestion,
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
    suggestions() {
      const offset = (this.page - 1) * this.suggestionsPerPage;
      return this.source.slice(offset, offset + this.suggestionsPerPage);
    },
    source() {
      return this.$store.getters['title/SUGGESTIONS'];
    },
    pages() {
      return Math.ceil(this.source.length / this.suggestionsPerPage);
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
