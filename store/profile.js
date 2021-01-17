export const state = () => ({
  profile: null
});

export const getters = {
  PROFILE: state => state.profile,
  SELF: (state, getters, rootState, rootGetters) => {
    const user = rootGetters["localStorage/USER"];
    return user && user.username === state.profile.username;
  },
  TVSHOWS: state =>
    Object.values(state.profile.flixlist).filter(
      element =>
        element.status !== "Unwatched" && element.title.summary.type === "show"
    ),
  FILMS: state =>
    Object.values(state.profile.flixlist).filter(
      element =>
        element.status !== "Unwatched" && element.title.summary.type === "movie"
    )
};

export const mutations = {
  PROFILE(state, profile) {
    state.profile = profile;
  }
};

export const actions = {
  async LOAD_USERNAME({ commit, rootGetters }, username) {
    let user = rootGetters["localStorage/USER"];
    if (!user || username !== user.username) {
      user = await this.$getUser(username);
    }
    await commit("PROFILE", user);
  }
};
