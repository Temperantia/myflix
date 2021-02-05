<template lang="pug">
v-col(cols='12', lg='10')
  v-container(fluid)
    v-row.title-border
      v-col
        h3 {{ profile.username.toUpperCase() + "'S REVIEWS" }}
      v-col.text-right
        .click(@click='$router.push("/profile/" + profile.username)') BACK TO PROFILE
  v-container(v-if='reviews.length > 0', fluid)
    review(:review='review', v-for='review in reviews', :key='review.id')
  v-container(v-else, fluid)
    v-row
      v-col
        p No reviews yet
</template>
<script lang='ts'>
import { Context } from '@nuxt/types';
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');
const reviewsModule = namespace('reviews');

@Component({ layout: 'profile' })
export default class ProfileReviews extends Vue {
  @profileModule.State('profile') profile!: any;
  @reviewsModule.State('profile') reviews!: any;

  async asyncData({ route, store }: Context) {
    await store.dispatch('profile/loadUsername', route.params.username);
    await store.dispatch('reviews/getProfile', route.params.username);
  }
}
</script>
