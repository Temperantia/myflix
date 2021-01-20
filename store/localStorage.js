import Vue from "vue";
import mergeState from "vue-object-merge";

export const state = () => ({
  user: null,
  connected: false
});

export const getters = {
  USER: state => {
    return state.user;
  },
  CONNECTED: state => {
    return state.connected;
  },
  USER_ID: state => {
    return state.user && state.user.id;
  }
};

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
  },
  USER_FAVORITE_ADD(state, favorite) {
    mergeState(state.user, favorite);
  },
  USER_FAVORITE_REMOVE(state, { type, id }) {
    Vue.delete(state.user.favorites[type], id);
  }
};
