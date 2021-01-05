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
  return await get(collectionReviews.where("title.id", "==", Number(id)));
}

async function getReviewsLatest() {
  return await get(collectionReviews.orderBy("postedOn", "desc").limit(3));
}

async function getRecommendations(id) {
  return await get(
    collectionRecommendations.where("title.id", "==", Number(id))
  );
}

async function getSearch() {
  return (await get(collectionData))
    .reduce((data, current) => [...data, ...JSON.parse(current.search)], [])
    .filter(title => {
      if (title.y === 0 || title.y >= 2030) {
        return false;
      }
      return !title.title;
    });
}

async function createReview(title, review, author) {
  const data = {
    author: {
      username: author.username,
      image: author.image
    },
    title: {
      id: title.summary.id,
      title: title.title,
      boxArt: title.boxArt,
      tallBoxArt: title.tallBoxArt ? title.tallBoxArt : title.boxArt,
      storyArt: title.storyArt
    },
    ...review,
    likes: [],
    postedOn: fireModule.firestore.Timestamp.now()
  };
  const ref = await collectionReviews.add(data);
  $store.commit("title/CREATE_REVIEW", data);

  data.id = ref.id;
  collectionUsers.doc(author.id).update({
    reviews: fireModule.firestore.FieldValue.arrayUnion(data)
  });
  $store.commit("localStorage/USER_REVIEW", data);
}

async function createRecommendation(title, recommendation, author) {
  const data = {
    author: {
      username: author.username,
      image: author.image
    },
    title: {
      id: title.summary.id,
      title: title.title,
      boxArt: title.boxArt,
      tallBoxArt: title.tallBoxArt ? title.tallBoxArt : title.boxArt,
      storyArt: title.storyArt
    },
    ...recommendation
  };
  const ref = await collectionRecommendations.add(data);
  $store.commit("title/CREATE_RECOMMENDATION", data);

  data.id = ref.id;
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
  const search = await getSearch();
  let categories = {};
  for (const item of search) {
    for (const category of item.c) {
      if (categories[category]) {
        categories[category].value++;
      } else {
        categories[category] = { category: category, value: 1, image: item.b };
      }
    }
  }
  categories = Object.values(categories)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  inject("getTitle", getTitle);
  inject("getReviews", getReviews);
  inject("getReviewsLatest", getReviewsLatest);
  inject("getRecommendations", getRecommendations);
  inject("createReview", createReview);
  inject("createRecommendation", createRecommendation);
  inject("updateFlixlist", updateFlixlist);
  inject("search", search);
  inject("categories", categories);
  inject("ratings", ratings);
  inject("maturities", maturities);
  inject("statusesTvShow", statusesTvShow);
  inject("statusesFilm", statusesFilm);
  return { doc, get };
};
