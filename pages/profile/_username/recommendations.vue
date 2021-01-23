<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 {{ user.username.toUpperCase() + "'S RECOMMENDATIONS" }}
      v-col.text-right
        .click(@click='$router.push("/profile/" + user.username)') BACK TO PROFILE
  v-container(v-if='recommendations.length > 0', fluid)
    recommendation(
      :recommendation='recommendation',
      v-for='recommendation in recommendations',
      :key='recommendation.id'
    )
  v-container(v-else, fluid)
    v-row
      v-col
        p No recommendations yet
</template>
<script>
export default {
  layout: 'profile',
  async asyncData({ route, store, $getRecommendationsProfile }) {
    const username = route.params.username;
    await store.dispatch('profile/LOAD_USERNAME', username);
    const recommendations = await $getRecommendationsProfile(username);
    return { recommendations };
  },
  computed: {
    user() {
      return this.$store.getters['profile/PROFILE'];
    },
  },
};
</script>
