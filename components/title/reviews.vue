<template lang="pug">
review-preview(v-if='preview', :review='review', :title='title')
review-edition(
  v-else-if='edition',
  :title='title',
  :review='review',
  :updateEpisodes='updateEpisodes',
  :updateRating='updateRating',
  :submit='submit'
)
div(v-else)
  v-container(fluid)
    v-row.title-border
      v-col(cols='12', lg='8')
        h3 REVIEWS
      v-col.text-lg-right(cols='12', lg='4')
        client-only
          button(
            v-if='$store.state.localStorage.connected',
            @click='edition = true'
          ) MAKE A REVIEW
          button(v-else, @click='$router.push("/sign-in")') SIGN IN TO MAKE A REVIEW
  template(v-if='reviews.length > 0')
    review(:review='review', v-for='review in reviews', :key='review.id')
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
<script>
export default {
  data: () => ({
    reviewsPerPage: 20,
    page: 1,
    edition: false,
    preview: false,
    review: {
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
    },
  }),
  mounted() {
    const id = this.$route.hash.substring(1);
    if (id) {
      const index = this.source.findIndex((review) => review.id === id);
      if (index !== -1) {
        this.page = Math.floor(index / this.reviewsPerPage) + 1;
        const checkExist = setInterval(() => {
          if (document.getElementById(id)) {
            this.$scrollTo('#review-' + id);
            clearInterval(checkExist);
          }
        }, 100);
      }
    }
  },
  methods: {
    updateEpisodes(event) {
      const value = event.target.value;
      if (value < 0) {
        this.review.episodes = 0;
      } else if (value > this.title.episodeCount) {
        this.review.episodes = this.title.episodeCount;
      }
    },
    updateRating(name, value) {
      this.review.ratings[name] = value;
      const scores = Object.values(this.review.ratings);
      scores.pop();
      this.review.ratings.Overall = Math.ceil(
        scores.reduce((sum, score) => sum + score, 0) / 5
      );
    },
    submit() {
      if (
        this.review.content.length < 200 ||
        this.review.content.length > 1000
      ) {
        this.$toast.error('Your review needs between 200 and 1000 characters.');
        return;
      }
      this.$createReview(
        this.title,
        this.review,
        this.$store.state.localStorage.user
      );

      this.preview = false;
      this.edition = false;
    },
  },
  computed: {
    title() {
      return this.$store.state.title.data;
    },
    reviews() {
      const offset = (this.page - 1) * this.reviewsPerPage;
      return this.source.slice(offset, offset + this.reviewsPerPage);
    },
    source() {
      return this.$store.getters['title/REVIEWS'];
    },
    pages() {
      return Math.ceil(this.source.length / this.reviewsPerPage);
    },
  },
};
</script>
