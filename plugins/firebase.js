function parse(doc) {
  return { id: doc.id, ...doc.data() };
}

export async function get(query) {
  const cache = await query.get({ source: "cache" });
  if (cache.docs.length > 0) {
    return cache.docs.map(doc => parse(doc));
  }
  const data = await query.get({ source: "server" });
  const docs = data.docs.map(doc => parse(doc));
  return docs;
}

export async function doc(query) {
  try {
    const cache = await query.get({ source: "cache" });
    return parse(cache);
  } catch (error) {
    const data = await query.get({ source: "server" });
    return parse(data);
  }
}

async function getPremieres() {
  const query = collectionVideos.where("month", "==", "true").limit(4);
  return await get(query);
}

async function getTrendingWeek() {
  const query = collectionVideos
    .orderBy("storyArt", "desc")
    .orderBy("popularity", "desc")
    .where("week", "==", true)
    .where("storyArt", "!=", null)
    .limit(4);
  return await get(query);
}

const maturities = {
  AL: "PG",
  "Kids OK": "TV-Y7",
  6: "TV-Y7",
  9: "G",
  12: "PG-13",
  14: "PG-13",
  16: "TV-MA",
  18: "TV-MA"
};

const ratings = {
  1: "Terrible",
  2: "Very Bad",
  3: "Bad",
  4: "Below Average",
  5: "Average",
  6: "Fine",
  7: "Good",
  8: "Very Good",
  9: "Great",
  10: "Outstanding"
};

const statusesTvShow = [
  "Unwatched",
  "Plan to Watch",
  "Watching",
  "Completed",
  "On-Hold",
  "Dropped"
];

const statusesFilm = [
  "Unwatched",
  "Plan to Watch",
  "Completed",
  "Rewatched",
  "Unfinished"
];

async function getTitle(id) {
  const query = collectionVideos.doc(id);
  const title = await doc(query);
  const numUsers = String(Object.keys(title.scores).length);
  const information = {
    Type: title.summary.type === "show" ? "TV Show" : "Movie",
    Seasons: title.seasonCount,
    Episodes: title.episodeCount,
    Renewed: title.summary.type == "show" ? "No" : null,
    Premiered: title.availability.availabilityStartTime
      ? dateFns.format(title.availability.availabilityStartTime, "MMM d, yyyy")
      : null,
    Producers: title.creators.join(", "),
    Genres: title.genres.map(genre => genre.name).join(", "),
    Duration: "idk",
    Rating: title.maturity
  };
  const statistics = {
    Score: title.score + " (scored by " + numUsers + " users)",
    Ranked: "#" + title.rank,
    Popularity: "#" + title.popularity,
    Followers: String(Object.keys(title.followers).length),
    Favorites: String(Object.keys(title.favorites).length)
  };

  if (!title.maturity) {
    title.maturity = "AL";
  } else {
    title.maturity = maturities[title.maturity];
  }

  return {
    ...title,
    information,
    statistics,
    numUsers
  };
}

async function getReviews(id) {
  return await get(collectionReviews.where("idVideo", "==", Number(id)));
}

async function getRecommendations(id) {
  return await get(
    collectionRecommendations.where("idVideo", "==", Number(id))
  );
}

async function getSearch() {
  return (await get(collectionData))
    .reduce((data, current) => [...data, ...JSON.parse(current.search)], [])
    .filter(title => !title.title)
    .map(title => {
      if (!title.m) {
        title.m = "AL";
      } else {
        title.m = maturities[title.m];
      }
      return title;
    });
}

async function createReview(idVideo, review, author) {
  let data = {
    author,
    idVideo,
    ...review,
    likes: [],
    postedOn: fireModule.firestore.Timestamp.now()
  };
  const ref = await collectionReviews.add(data);
  $store.commit("title/CREATE_REVIEW", data);
  data = {
    id: ref.id,
    idVideo,
    ...review,
    likes: [],
    postedOn: fireModule.firestore.Timestamp.now()
  };
  collectionUsers.doc(author.id).update({
    reviews: fireModule.firestore.FieldValue.arrayUnion(data)
  });
  $store.commit("localStorage/USER_REVIEW", data);
}

async function createRecommendation(idVideo, recommendation, author) {
  let data = {
    author,
    idVideo,
    ...recommendation
  };
  const ref = await collectionRecommendations.add(data);
  $store.commit("title/CREATE_RECOMMENDATION", data);
  data = {
    id: ref.id,
    idVideo,
    ...recommendation
  };
  collectionUsers.doc(author.id).update({
    recommendations: fireModule.firestore.FieldValue.arrayUnion(data)
  });
  $store.commit("localStorage/USER_RECOMMENDATION", data);
}

function updateFlixlist(idUser, title, status, episodes, score) {
  const data = {
    status,
    episodes,
    score,
    title,
    postedOn: fireModule.firestore.Timestamp.now()
  };
  collectionUsers.doc(idUser).update({ [`flixlist.${title.id}`]: data });
  $store.commit("localStorage/USER_FLIXLIST", { idTitle: title.id, data });
  if (score) {
    /* collectionVideos
      .doc(title.id)
      .update({ ["scores." + title.id]: { time: new Date(), value: score } }); */
  }
}

let firestore;
let fireModule;
let dateFns;
let $store;
let collectionData;
let collectionUsers;
let collectionVideos;
let collectionReviews;
let collectionRecommendations;
let collectionStats;

export default async ({ $fire, $fireModule, $dateFns, store }, inject) => {
  firestore = $fire.firestore;
  fireModule = $fireModule;
  dateFns = $dateFns;
  $store = store;
  collectionData = firestore.collection("data");
  collectionUsers = firestore.collection("users");
  collectionVideos = firestore.collection("videos");
  collectionReviews = firestore.collection("reviews");
  collectionRecommendations = firestore.collection("recommendations");
  collectionStats = firestore.collection("stats");
  inject("getPremieres", getPremieres);
  inject("getTrendingWeek", getTrendingWeek);
  inject("getTitle", getTitle);
  inject("getReviews", getReviews);
  inject("getRecommendations", getRecommendations);
  inject("createReview", createReview);
  inject("createRecommendation", createRecommendation);
  inject("updateFlixlist", updateFlixlist);
  inject("search", await getSearch());
  inject("ratings", ratings);
  inject("maturities", maturities);
  inject("statusesTvShow", statusesTvShow);
  inject("statusesFilm", statusesFilm);
  return { doc, get };
};
