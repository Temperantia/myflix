<template lang="pug">
review-preview(
  v-if='preview',
  :review='review',
  :submit='submit',
  @preview='(value) => (preview = value)',
  @cancel='() => (edition = false)'
)
review-edition(
  v-else-if='edition',
  :review='review',
  :updateEpisodes='updateEpisodes',
  :updateRating='updateRating',
  :submit='submit',
  @preview='(value) => (preview = value)',
  @cancel='() => (edition = false)'
)
div(v-else)
  v-container(fluid)
    v-row.title-border
      v-col(cols='12', lg='8')
        h3 REVIEWS
      v-col.text-lg-right(cols='12', lg='4')
        client-only
          button(v-if='connected', @click='edition = true') MAKE A REVIEW
          button(v-else, @click='$router.push("/sign-in")') SIGN IN TO MAKE A REVIEW
  template(v-if='reviews.length > 0')
    review(
      :review='review',
      :title='title',
      v-for='review in reviews',
      :key='review.id'
    )
    client-only(v-if='pages > 1')
      v-container(fluid)
        v-row.ma-0(justify='center')
          v-col
            v-pagination(:length='pages', v-model='page', :total-visible='7')
  v-container(v-else, fluid)
    v-row
      v-col
        p No reviews yet
</template>
<script lang='ts'>
import { Vue, Component, namespace, Watch } from 'nuxt-property-decorator';

const reviewsModule = namespace('reviews');
const titleModule = namespace('title');
const localStorageModule = namespace('localStorage');

@Component
export default class Reviews extends Vue {
  @titleModule.State('title') title!: any;
  @reviewsModule.State('reviews') source!: any;
  @localStorageModule.State('connected') connected!: boolean;
  @reviewsModule.Action('create') createReview!: any;

  page = 1;
  edition = false;
  preview = false;
  review: any = {
    content: '',
    episodes: 0,
    ratings: {
      Plot: 10,
      Visuals: 10,
      Sound: 10,
      Acting: 10,
      Enjoyment: 10,
      Overall: 10,
    },
  };

  get reviews() {
    const offset = (this.page - 1) * this.$config.reviewsPerPage;
    return this.source.slice(offset, offset + this.$config.reviewsPerPage);
  }

  get pages() {
    return Math.ceil(this.source.length / this.$config.reviewsPerPage);
  }

  mounted() {
    this._mounted();
  }

  @Watch('$router')
  onRouteChanged() {
    this._mounted();
  }

  private _mounted() {
    const id = this.$route.hash.substring(1);
    if (id) {
      const index = this.source.findIndex((review: any) => review.id === id);
      if (index === -1) {
        return this.$nuxt.error({
          statusCode: 410,
          message: 'Review no longer exists',
        });
      }
      this.page = Math.floor(index / this.$config.reviewsPerPage) + 1;
      const checkExist = setInterval(() => {
        if (document.getElementById(id)) {
          this.$scrollTo('#review-' + id);
          clearInterval(checkExist);
        }
      }, 100);
    }
  }

  updateEpisodes(event: any) {
    const value = event.target.value;
    if (value < 0) {
      this.review.episodes = 0;
    } else if (value > this.title.episodeCount) {
      this.review.episodes = this.title.episodeCount;
    }
  }

  updateRating(name: string, value: string) {
    this.review.ratings[name] = value;
    const scores: any[] = Object.values(this.review.ratings);
    scores.pop();
    this.review.ratings.Overall = Math.ceil(
      scores.reduce((sum, score) => sum + score, 0) / 5
    );
  }

  submit() {
    this.createReview(this.review);
    this.preview = false;
    this.edition = false;
  }
}
</script>
