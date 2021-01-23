<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 {{ user.username.toUpperCase() + "'S REVIEWS" }}
      v-col.text-right
        .click(@click='$router.push("/profile/" + user.username)') BACK TO PROFILE
  v-container(v-if='reviews.length > 0', fluid)
    review(
      :review='review',
      v-for='review in reviews',
      :key='review.id'
    )
  v-container(v-else, fluid)
    v-row
      v-col
        p No reviews yet
</template>
<script>
export default {
  layout: 'profile',
  async asyncData({ route, store, $getReviewsProfile }) {
    const username = route.params.username;
    await store.dispatch('profile/LOAD_USERNAME', username);
    const reviews = await $getReviewsProfile(username);
    return { reviews };
  },
  computed: {
    user() {
      return this.$store.getters['profile/PROFILE'];
    },
  },
};
</script>
