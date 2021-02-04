<template lang="pug">
div
  v-row
    v-col(cols='12', lg='5')
      h1.title-border.font-weight-bold LATEST USER SUGGESTIONS
  v-row
    v-col(
      cols='12',
      lg='4',
      v-for='suggestion in latestSuggestions',
      :key='suggestion.id'
    )
      v-container(fluid)
        v-row
          v-col(cols='4', lg='2')
            nuxt-link(:to='suggestion.title.route')
              img(:src='suggestion.title.tallBoxArt')
          v-col(cols='8', lg='4') If you liked
            nuxt-link(:to='suggestion.title.route')
              .red-netflix--text {{ suggestion.title.title }}
            //-client-only(v-if='favorites')
              .click(
                v-if='isFavorite(suggestion.title.id)',
                @click='removeFavoriteFromId(suggestion.title.id)'
              )
                v-icon mdi-star
                span In Favorites
              .click(v-else, @click='addFavoriteFromId(suggestion.title.id)')
                v-icon mdi-star-outline
                span Add to Favorites
          v-col(cols='4', lg='2')
            nuxt-link(:to='suggestion.similar.route')
            img(:src='suggestion.similar.image')
          v-col(cols='8', lg='4') Then you might like...
            nuxt-link(:to='suggestion.similar.route')
              .red-netflix--text {{ suggestion.similar.title }}
            //-client-only(v-if='favorites')
              .click(
                v-if='isFavorite(suggestion.similar.id)',
                @click='removeFavoriteFromId(suggestion.similar.id)'
              )
                v-icon mdi-star
                span In Favorites
              .click(
                v-else,
                @click='addFavoriteFromId(suggestion.similar.id)'
              )
                v-icon mdi-star-outline
                span Add to Favorites
        v-row
          v-col
            p
              span(v-html='content(suggestion.content)')
              nuxt-link(:to='route(suggestion)')
                span.red-netflix--text.click.ml-1 show more
            div Suggestion by
              nuxt-link(:to='"/profile/" + suggestion.author.username')
                span.red-netflix--text {{ " " + suggestion.author.username }}
              span {{ " - " + $moment(suggestion.postedOn.seconds * 1000).format("MMM D, yyyy").toUpperCase() }}
</template>
<script lang="ts">
import slugify from 'slugify';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const suggestionsModule = namespace('suggestions');

@Component
export default class Home extends Vue {
  slugify = slugify;
  @suggestionsModule.State('latest') latestSuggestions!: any;

  content(content: string) {
    return content.length > 300 ? content.substring(0, 300) + ' ...' : content;
  }

  route(suggestion: any) {
    return (
      (suggestion.title.type === 'show' ? 'tvshows/' : 'films/') +
      slugify(suggestion.title.title, { lower: true, strict: true }) +
      '/suggestions#suggestion-' +
      suggestion.id
    );
  }
}
</script>
