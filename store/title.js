export const state = () => ({
  data: null,
  reviews: [],
  recommendations: []
});

export const getters = {
  TITLE: state => {
    return state.data;
  }
};

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
  LIKE(state, payload) {
    const review = state.reviews.find(review => review.id === payload.id);
    review.likes.push(payload.idUser);
  },
  UNLIKE(state, payload) {
    const review = state.reviews.find(review => review.id === payload.id);
    const index = review.likes.indexOf(payload.idUser);
    review.likes.splice(index, 1);
  },
  CREATE_REVIEW(state, review) {
    state.reviews.push(review);
  },
  CREATE_RECOMMENDATION(state, recommendation) {
    state.recommendations.push(recommendation);
  },
  REPORT_REVIEW(state, payload) {
    const review = state.reviews.find(review => review.id === payload.id);
    review.reports.push(payload.idUser);
  },
  REPORT_RECOMMENDATION(state, payload) {
    const recommendation = state.recommendations.find(
      recommendation => recommendation.id === payload.id
    );
    recommendation.reports.push(payload.idUser);
  }
};
