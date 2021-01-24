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
<script>
export default {
  layout: 'profile',
  async asyncData({ route, store, $getSuggestionsProfile }) {
    const username = route.params.username;
    await store.dispatch('profile/LOAD_USERNAME', username);
    const suggestions = await $getSuggestionsProfile(username);
    return { suggestions };
  },
  computed: {
    user() {
      return this.$store.getters['profile/PROFILE'];
    },
  },
};
</script>
