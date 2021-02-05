<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 {{ profile.username.toUpperCase() + "'S SUGGESTIONS" }}
      v-col.text-right
        .click(@click='$router.push("/profile/" + profile.username)') BACK TO PROFILE
  v-container(v-if='suggestions.length > 0', fluid)
    suggestion(
      :suggestion='suggestion',
      v-for='suggestion in suggestions',
      :key='suggestion.id'
    )
  v-container(v-else, fluid)
    v-row
      v-col
        p No suggestions yet
</template>
<script lang='ts'>
import { Context } from '@nuxt/types';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');
const suggestionsModule = namespace('suggestions');

@Component({ layout: 'profile' })
export default class ProfileSuggestions extends Vue {
  @profileModule.State('profile') profile!: any;
  @suggestionsModule.State('profile') suggestions!: any;

  async asyncData({ route, store }: Context) {
    await store.dispatch('profile/loadUsername', route.params.username);
    await store.dispatch('reviews/getProfile', route.params.username);
  }
}
</script>
