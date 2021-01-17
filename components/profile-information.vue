<template lang="pug">
v-col(cols='12', lg='2')
  img(:src='user.image ? user.image : "/defaultUser.png"')
  v-row
    v-col.pt-1.pb-0
      b Gender:
    v-col.pt-1.pb-0.text-right {{ user.gender || "-" }}
  v-row
    v-col.pt-1.pb-0
      b Birthday:
    v-col.pt-1.pb-0.text-right {{ user.birthdate ? new Date(user.birthdate.seconds * 1000).getFullYear() : "-" }}
  v-row
    v-col.pt-1.pb-0
      b Location:
    v-col.pt-1.pb-0.text-right {{ user.location || "-" }}
  v-row
    v-col.pt-1.pb-0
      b Join Date:
    v-col.pt-1.pb-0.text-right {{ $moment(user.created.seconds * 1000).format("MMM D, yyyy") }}
  v-row
    v-col.text-center
      nuxt-link(:to='"/flixlist/" + user.username')
        button.button.flixlist FlixList
  h3.title-border INFORMATION
  v-row
    v-col.pt-1.pb-0
      b Reviews:
    v-col.pt-1.pb-0.text-right {{ user.reviews.length }}
  v-row
    v-col.pt-1.pb-0
      b Recommendations:
    v-col.pt-1.pb-0.text-right {{ user.recommendations.length }}
  v-row
    v-col.pt-1.pb-0
      b Films:
    v-col.pt-1.pb-0.text-right {{ films.length }}
  v-row
    v-col.pt-1.pb-0
      b TV Shows:
    v-col.pt-1.pb-0.text-right {{ tvShows.length }}
</template>
<script>
export default {
  props: ['user', 'tvShows', 'films'],
  async asyncData({ route, store }) {
    const username = route.params.username;
    await store.dispatch('profile/LOAD_USERNAME', username);
  },
};
</script>
