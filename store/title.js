export const state = () => ({
  data: null,
  reviews: [],
  recommendations: []
});

export const mutations = {
  LOAD_TITLE(state, data) {
    state.data = data;
  },
  LOAD_REVIEWS(state, reviews) {
    state.reviews = reviews;
  },
  LOAD_RECOMMENDATIONS(state, recommendations) {
    state.recommendations = recommendations;
  },
  CREATE_REVIEW(state, review) {
    state.reviews.push(review);
  },
  CREATE_RECOMMENDATION(state, recommendation) {
    state.recommendations.push(recommendation);
  }
};
