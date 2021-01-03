import { doc, get } from "./firebase";

async function userExists(id) {
  return await doc(collectionUsers.doc(id));
}

async function getUser(username) {
  const user = await get(
    collectionUsers.where("usernameLower", "==", username.toLowerCase())
  );
  if (user.length === 0) {
    return null;
  }

  return user[0];
}

async function signIn(id) {
  const user = await userExists(id);
  if (user) {
    $store.commit("localStorage/USER_LOGIN", user);
    return true;
  }
  return false;
}

async function register(id, username, photoURL) {
  const user = {
    username: username,
    usernameLower: username.toLowerCase(),
    image: photoURL ? photoURL : null,
    reviews: [],
    recommendations: [],
    flixlist: {},
    created: fireModule.firestore.Timestamp.now()
  };

  await collectionUsers.doc(id).set(user);
  $store.commit("localStorage/USER_LOGIN", { id, ...user });
}

async function updateUser(user) {
  await collectionUsers.doc(user.id).set(user);
  $store.commit("localStorage/USER_UPDATE", user);
}

let firestore;
let fireModule;
let collectionUsers;
let $store;

export default ({ $fire, $fireModule, store }, inject) => {
  firestore = $fire.firestore;
  fireModule = $fireModule;
  collectionUsers = firestore.collection("users");
  $store = store;
  inject("register", register);
  inject("signIn", signIn);
  inject("getUser", getUser);
  inject("updateUser", updateUser);
  inject("userExists", userExists);
};
