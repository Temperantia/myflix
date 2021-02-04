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
import { Vue, Component, namespace } from 'nuxt-property-decorator';

const profileModule = namespace('profile');
const reviewsModule = namespace('reviews');

@Component({ layout: 'profile' })
export default class ProfileReviews extends Vue {
  @profileModule.State('profile') profile!: any;
  @profileModule.Getter('reviewsProfile') reviews!: any;
  @profileModule.Action('loadUsername') loadUsername!: any;
  @reviewsModule.Action('getProfile') getReviews!: any;

  created() {
    this.loadUsername(this.$route.params.username);
    this.getReviews(this.$route.params.username);
  }
}
</script>
