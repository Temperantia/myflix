<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 {{ user.username.toUpperCase() + "'S SUGGESTIONS" }}
      v-col.text-right
        .click(@click='$router.push("/profile/" + user.username)') BACK TO PROFILE
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
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');
const suggestionsModule = namespace('suggestions');

@Component({ layout: 'profile' })
export default class ProfileSuggestions extends Vue {
  @profileModule.State('profile') profile!: any;
  @suggestionsModule.Getter('profile') suggestions!: any;
  @profileModule.Action('loadUsername') loadUsername!: any;
  @suggestionsModule.Action('getProfile') getSuggestions!: any;

  created() {
    this.loadUsername(this.$route.params.username);
    this.getSuggestions(this.$route.params.username);
  }
}
</script>
