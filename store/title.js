export const state = () => ({
  data: null,
  status: "",
  episodes: "",
  score: "",
  bingeworthy: false,
  saved: false,
  reviews: [],
  suggestions: []
});

export const getters = {
  TITLE: state => state.data,
  REVIEWS: state => state.reviews,
  SUGGESTIONS: state => state.suggestions
};

export const mutations = {
  LOAD_TITLE(state, data) {
    state.data = data;
  },
  UPDATE_STATUS(state, payload) {
    if (payload.value === "Remove from List") {
      state.status = "";
      return;
    }
    state.status = payload.value;
    if (payload.title.summary.type === "show") {
      if (state.status === "Completed") {
        state.episodes = payload.title.episodeCount;
      } else if (
        !state.status ||
        state.episodes === payload.title.episodeCount
      ) {
        state.episodes = 0;
      }
    }
    state.saved = false;
  },
  UPDATE_EPISODES(state, payload) {
    if (payload.value <= 0) {
      state.episodes = 0;
      state.status = "";
    } else if (payload.value >= payload.title.episodeCount) {
      state.episodes = payload.title.episodeCount;
      state.status = "Completed";
    } else {
      state.episodes = payload.value;
      if (state.status === "Completed" || !state.status) {
        state.status = "Watching";
      }
    }
    state.saved = false;
  },
  UPDATE_SCORE(state, score) {
    state.score = score;
    state.saved = false;
  },
  UPDATE_BINGEWORTHY(state, bingeworthy) {
    state.bingeworthy = bingeworthy;
    state.saved = false;
  },
  UPDATE_SAVED(state, saved) {
    state.saved = saved;
  },
  LOAD_FLIXLIST(state, { flixlist, ratings }) {
    if (flixlist.status) {
      state.status = flixlist.status;
    }
    if (flixlist.episodes) {
      state.episodes = flixlist.episodes;
    }
    if (flixlist.score) {
      state.score = `${flixlist.score} - ${ratings[flixlist.score]}`;
    }
    if (flixlist.bingeworthy) {
      state.bingeworthy = state.bingeworthy;
    }
    state.saved = false;
  },
  LOAD_REVIEWS(state, reviews) {
    state.reviews = reviews;
  },
  LOAD_SUGGESTIONS(state, suggestions) {
    state.suggestions = suggestions;
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
    state.reviews.unshift(review);
  },
  CREATE_SUGGESTION(state, suggestion) {
    state.suggestions.unshift(suggestion);
  },
  REPORT_REVIEW(state, payload) {
    const review = state.reviews.find(review => review.id === payload.id);
    review.reports.push(payload.idUser);
  },
  REPORT_SUGGESTION(state, payload) {
    const suggestion = state.suggestions.find(
      suggestion => suggestion.id === payload.id
    );
    suggestion.reports.push(payload.idUser);
  }
};
