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
        @click='(title) => (suggestion.similar = title)'
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
          button(v-if='connected', @click='edition = true') MAKE A SUGGESTION
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
<script lang='ts'>
import { Vue, Component, namespace, Watch } from 'nuxt-property-decorator';

const localStorageModule = namespace('localStorage');
const suggestionsModule = namespace('suggestions');
const titleModule = namespace('title');

@Component
export default class Suggestions extends Vue {
  @titleModule.State('title') title!: any;
  @suggestionsModule.State('suggestions') source!: any;
  @localStorageModule.State('connected') connected!: boolean;
  @suggestionsModule.Action('create') createSuggestion!: any;
  suggestionsPerPage = 20;
  page = 1;
  edition = false;
  suggestion = {
    content: '',
    similar: null,
  };

  mounted() {
    this._mounted();
  }

  @Watch('$router')
  onRouteChanged() {
    this._mounted();
  }

  private _mounted() {
    const id = this.$route.hash.substring(1);
    if (id) {
      const index = this.source.findIndex(
        (suggestion: any) => suggestion.id === id
      );
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
  }

  submit() {
    this.createSuggestion(this.suggestion);
    this.edition = false;
  }

  get suggestions() {
    const offset = (this.page - 1) * this.suggestionsPerPage;
    return this.source.slice(offset, offset + this.suggestionsPerPage);
  }

  get pages() {
    return Math.ceil(this.source.length / this.suggestionsPerPage);
  }
}
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
