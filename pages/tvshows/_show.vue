<template lang="pug">
nuxt-child
</template>
<script>
export default {
  layout: 'title',
  async asyncData({
    route,
    $getTitle,
    $getReviews,
    $getSuggestions,
    store,
  }) {
    const title = await $getTitle(route.params.id);
    const reviews = await $getReviews(route.params.id);
    const suggestions = await $getSuggestions(route.params.id);

    store.commit('title/LOAD_TITLE', title);
    store.commit('title/LOAD_REVIEWS', reviews);
    store.commit('title/LOAD_SUGGESTIONS', suggestions);
  },
};
</script>
