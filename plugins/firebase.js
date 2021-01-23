function parse(doc) {
  return { id: doc.id, ...doc.data() };
}

export async function get(query, name, cookies) {
  const cache = await query.get({ source: "cache" });
  if (!name || (name && (!cookies.get(name) || cache.docs.length === 0))) {
    const data = await query.get({ source: "server" });
    if (name) {
      cookies.set(name, true, {
        path: "/",
        maxAge: 60 * 60 * 24
      });
    }
    return data.docs.map(doc => parse(doc));
  }
  return cache.docs.map(doc => parse(doc));
}

export async function doc(query, name, cookies) {
  let cache;
  let e;
  try {
    cache = await query.get({ source: "cache" });
  } catch (error) {
    e = error;
  }
  if (!name || (name && (!cookies.get(name) || e))) {
    const data = await query.get({ source: "server" });
    if (name) {
      cookies.set(name, true, {
        path: "/",
        maxAge: 60 * 60 * 24
      });
    }
    return parse(data);
  }
  return parse(cache);
}

const maturitiesEurope = {
  AL: "PG",
  "Kids OK": "TV-Y7",
  6: "TV-Y7",
  9: "G",
  12: "PG-13",
  14: "PG-13",
  16: "TV-MA",
  18: "TV-MA"
};

const maturities = ["TV-Y7", "G", "PG", "PG-13", "TV-MA"];

const ratings = {
  10: "Masterpiece",
  9: "Special",
  8: "Outstanding",
  7: "Good",
  6: "Fine",
  5: "Average",
  4: "Bad",
  3: "Terrible",
  2: "Awful",
  1: "Horrible"
};

const statusesTvShow = [
  "Watching",
  "Dropped",
  "Save for Later",
  "On-Hold",
  "Completed"
];

const statusesFilm = ["Save for Later", "Completed", "Rewatched", "Unfinished"];

function titleStatusColor(status) {
  if (status === "Watching") {
    return "green-watching--text";
  } else if (status === "Dropped") {
    return "red-dropped--text";
  } else if (status === "Save for Later") {
    return "grey-save-for-later--text";
  } else if (status === "On-Hold") {
    return "yellow-on-hold--text";
  } else if (status === "Completed") {
    return "blue-completed--text";
  }
  return "grey-button--text";
}

export default async (
  { $fire, $fireModule, $moment, $toast, store, $cookies },
  inject
) => {
  const firestore = $fire.firestore;
  const collectionData = firestore.collection("data");
  const collectionGlobals = firestore.collection("globals");
  const collectionUsers = firestore.collection("users");
  const collectionVideos = firestore.collection("videos");
  const collectionReviews = firestore.collection("reviews");
  const collectionRecommendations = firestore.collection("recommendations");

  async function getGlobals() {
    const globals = await doc(collectionGlobals.doc("globals"));
    let contentRequests = [];
    for (const idsUser of Object.values(globals.contentRequests)) {
      contentRequests = [...contentRequests, ...idsUser];
    }
    globals.contentRequests = contentRequests;
    return globals;
  }

  async function getTitle(id) {
    const query = collectionVideos.doc(id);
    const title = await doc(query);
    const numUsers = String(Object.keys(title.scores).length);
    const information = {
      Type: title.summary.type === "show" ? "TV Show" : "Movie",
      Premiered: title.availability.availabilityStartTime
        ? $moment(title.availability.availabilityStartTime, "MMM d, yyyy")
        : null,
      Producers: title.creators.join(", "),
      Genres: title.genres.map(genre => genre.name).join(", "),
      //Duration: "idk",
      Rating: title.maturity
    };
    if (title.summary.type === "show") {
      //Renewed: title.summary.type == "show" ? "No" : null,
      information.Seasons = title.seasonCount;
      information.Episodes = title.episodeCount;
    }
    const statistics = {
      Score: title.score + " (scored by " + numUsers + " users)",
      Ranked: "#" + title.rank,
      Popularity: "#" + title.popularity,
      Followers: String(Object.keys(title.followers).length),
      Favorites: String(Object.keys(title.favorites).length)
    };

    if (!title.maturity) {
      information.Rating = "AL";
    } else {
      information.Rating = maturities[title.maturity];
    }

    return {
      ...title,
      information,
      statistics,
      numUsers
    };
  }

  async function getReviews(id) {
    return await get(
      collectionReviews.where("title.id", "==", Number(id)),
      "getReviews",
      $cookies
    );
  }

  async function getReviewsLatest() {
    return await get(
      collectionReviews.orderBy("postedOn", "desc").limit(3),
      "getReviewsLatest",
      $cookies
    );
  }

  async function getReviewsProfile(username) {
    return await get(
      collectionReviews.where("author.username", "==", username)
    );
  }

  async function getRecommendations(id) {
    return await get(
      collectionRecommendations.where("title.id", "==", Number(id)),
      "getRecommendations",
      $cookies
    );
  }

  async function getRecommendationsLatest() {
    return await get(
      collectionRecommendations.orderBy("postedOn", "desc").limit(3),
      "getRecommendationsLatest",
      $cookies
    );
  }

  async function getRecommendationsProfile(username) {
    return await get(
      collectionRecommendations.where("author.username", "==", username)
    );
  }

  async function getSearch() {
    return (await get(collectionData, "getSearch", $cookies))
      .reduce((data, current) => [...data, ...JSON.parse(current.search)], [])
      .filter(title => {
        if (title.y === 0 || title.y >= 2030) {
          return false;
        }
        return !title.title;
      })
      .map(title => {
        if (title.u && !title.s) {
          title.s = 1;
        }
        return title;
      });
  }

  async function createReview(title, review, author) {
    const data = {
      author: {
        id: author.id,
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
      reports: [],
      likes: [],
      postedOn: $fireModule.firestore.Timestamp.now()
    };
    const ref = await collectionReviews.add(data);
    store.commit("title/CREATE_REVIEW", data);

    data.id = ref.id;
    collectionUsers.doc(author.id).update({
      reviews: $fireModule.firestore.FieldValue.arrayUnion(data)
    });
    store.commit("localStorage/USER_REVIEW", data);
  }

  async function createRecommendation(title, recommendation, author) {
    const data = {
      author: {
        id: author.id,
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
      ...recommendation,
      reports: [],
      postedOn: $fireModule.firestore.Timestamp.now()
    };
    const ref = await collectionRecommendations.add(data);
    store.commit("title/CREATE_RECOMMENDATION", data);

    data.id = ref.id;
    collectionUsers.doc(author.id).update({
      recommendations: $fireModule.firestore.FieldValue.arrayUnion(data)
    });
    store.commit("localStorage/USER_RECOMMENDATION", data);
  }

  async function updateFlixlist(title, status, episodes, score, bingeworthy) {
    if (!status) {
      $toast.error("Select a status");
      return false;
    }
    const idUser = store.getters["localStorage/USER"].id;

    const data = {
      status,
      episodes,
      score,
      title,
      postedOn: $fireModule.firestore.Timestamp.now()
    };
    collectionUsers.doc(idUser).update({ [`flixlist.${title.id}`]: data });
    store.commit("localStorage/USER_FLIXLIST", { idTitle: title.id, data });

    const video = { ["followers." + idUser]: new Date() };
    if (score) {
      video["scores." + idUser] = { time: new Date(), value: score };
    }
    video.bingeworthiness = bingeworthy
      ? $fireModule.firestore.FieldValue.arrayUnion(idUser)
      : $fireModule.firestore.FieldValue.arrayRemove(idUser);
    collectionVideos.doc(title.id).update(video);
    store.commit('title/UPDATE_SAVED', true);
    $toast.success("Flixlist updated");
    return true;
  }

  function addFavorite(title, type) {
    const idUser = store.getters["localStorage/USER"].id;
    const favorite = {
      favorites: {
        [type]: {
          [title.id]: {
            image: title.tallBoxArt ? title.tallBoxArt : title.boxArt,
            title: title.title,
            year: title.releaseYear,
            maturity: title.maturity ? title.maturity : null,
            season: title.seasonCount ? title.seasonCount : 1,
            genres: title.genres
            //duration: title.duration
          }
        }
      }
    };
    collectionUsers.doc(idUser).update(favorite);
    store.commit("localStorage/USER_FAVORITE_ADD", favorite);

    collectionVideos.doc(title.id).update({
      favorites: $fireModule.firestore.FieldValue.arrayUnion(idUser)
    });
  }

  function removeFavorite(title, type) {
    const idUser = store.getters["localStorage/USER"].id;
    collectionUsers.doc(idUser).update({
      ["favorites." +
      type +
      "." +
      title.id]: $fireModule.firestore.FieldValue.delete()
    });
    store.commit("localStorage/USER_FAVORITE_REMOVE", { type, id: title.id });

    collectionVideos.doc(title.id).update({
      favorites: $fireModule.firestore.FieldValue.arrayRemove(idUser)
    });
  }

  function like(id) {
    const idUser = store.getters["localStorage/USER"].id;
    collectionReviews.doc(id).update({
      likes: $fireModule.firestore.FieldValue.arrayUnion(idUser)
    });
    store.commit("title/LIKE", { id, idUser });
  }

  function unlike(id) {
    const idUser = store.getters["localStorage/USER"].id;
    collectionReviews.doc(id).update({
      likes: $fireModule.firestore.FieldValue.arrayRemove(idUser)
    });
    store.commit("title/UNLIKE", { id, idUser });
  }

  function report(collection, id) {
    const idUser = store.getters["localStorage/USER"].id;
    firestore
      .collection(collection)
      .doc(id)
      .update({
        reports: $fireModule.firestore.FieldValue.arrayUnion(idUser)
      });
    store.commit(
      "title/REPORT_" + collection === "reviews" ? "REVIEW" : "RECOMMENDATION",
      {
        id,
        idUser
      }
    );
  }

  function requestContent(country) {
    const idUser = store.getters["localStorage/USER"].id;
    collectionGlobals.doc("globals").update({
      ["contentRequests." +
      country]: $fireModule.firestore.FieldValue.arrayUnion(idUser)
    });
  }

  const globals = await getGlobals();
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

  inject("titleStatusColor", titleStatusColor);
  inject("getTitle", getTitle);
  inject("getReviews", getReviews);
  inject("getReviewsLatest", getReviewsLatest);
  inject("getReviewsProfile", getReviewsProfile);
  inject("getRecommendations", getRecommendations);
  inject("getRecommendationsLatest", getRecommendationsLatest);
  inject("getRecommendationsProfile", getRecommendationsProfile);
  inject("createReview", createReview);
  inject("createRecommendation", createRecommendation);
  inject("updateFlixlist", updateFlixlist);
  inject("addFavorite", addFavorite);
  inject("removeFavorite", removeFavorite);
  inject("like", like);
  inject("unlike", unlike);
  inject("report", report);
  inject("requestContent", requestContent);
  inject("globals", globals);
  inject("search", search);
  inject("categories", categories);
  inject("ratings", ratings);
  inject("maturitiesEurope", maturitiesEurope);
  inject("maturities", maturities);
  inject("statusesTvShow", statusesTvShow);
  inject("statusesFilm", statusesFilm);
  return { doc, get };
};
