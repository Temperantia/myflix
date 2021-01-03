import Vue from "vue";

export const state = () => ({
  user: {
    reviews: [],
    recommendations: [],
    flixlist: null
  },
  connected: false
});

export const mutations = {
  USER_LOGIN(state, user) {
    state.user = user;
    state.connected = true;
  },
  USER_LOGOUT(state) {
    state.user = null;
    state.connected = false;
  },
  USER_UPDATE(state, user) {
    state.user = user;
  },
  USER_REVIEW(state, review) {
    state.user.reviews.push(review);
  },
  USER_RECOMMENDATION(state, recommendation) {
    state.user.recommendations.push(recommendation);
  },
  USER_FLIXLIST(state, { idTitle, data }) {
    Vue.set(state.user.flixlist, idTitle, data);
  }
};
