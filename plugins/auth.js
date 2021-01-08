import { doc, get } from "./firebase";

async function userExists(id, provider) {
  if (provider) {
    const user = await get(
      collectionUsers.where("providers." + provider, "==", id)
    );
    if (user.length === 0) {
      return null;
    }

    return user[0];
  }
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

async function deleteUser(email, password) {
  if (email && password) {
    const id = auth.currentUser.uid;
    let userCheck;
    try {
      userCheck = await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error || userCheck.uid !== id) {
        return "Incorrect Email or Password";
      }
    }
  }

  const user = await doc(collectionUsers.doc(auth.currentUser.uid));
  await collectionUsers.doc(user.id).delete();
  for (const name in user.providers) {
    const provider = user.providers[name];
    if (provider.id !== user.id) {
      let cred;
      if (name === "google") {
        cred = new fireModule.auth.GoogleAuthProvider.credential(
          null,
          provider.token
        );
      } else if (name === "facebook") {
        cred = new fireModule.auth.FacebookAuthProvider.credential(
          provider.token
        );
      }
      await auth.signInWithCredential(cred);
      await auth.currentUser.delete();
    }
  }

  if (email && password) {
    await auth.signInWithEmailAndPassword(email, password);
    await auth.currentUser.delete();
  }

  $store.commit("localStorage/USER_LOGOUT");
  $app.router.push("/");
}

async function signIn(id, provider) {
  const user = await userExists(id, provider);
  if (user) {
    $store.commit("localStorage/USER_LOGIN", user);
    return true;
  }
  return false;
}

async function register(id, email, username, photoURL, provider, token) {
  const user = {
    email,
    username: username,
    usernameLower: username.toLowerCase(),
    usernameCoolDown: new Date(),
    image: photoURL ? photoURL : null,
    reviews: [],
    recommendations: [],
    flixlist: {},
    created: fireModule.firestore.Timestamp.now(),
    providers: {}
  };

  if (provider) {
    user.providers[provider] = { id, token };
  }

  await collectionUsers.doc(id).set(user);
  $store.commit("localStorage/USER_LOGIN", { id, ...user });
  $app.router.push("/");
}

async function updateUser(user, passwordNew, passwordCurrent, email, username) {
  let redirect;
  if (passwordNew || email) {
    const data = await doc(collectionUsers.doc(user.id));
    try {
      await auth.signInWithEmailAndPassword(data.email, passwordCurrent);
    } catch (error) {
      return "Incorrect Password";
    }

    if (passwordNew) {
      await auth.currentUser.updatePassword(passwordNew);
    }
    if (email) {
      await auth.currentUser.updateEmail(email);
      user.email = email;
    }
  }

  if (username) {
    if (
      dateFns.isBefore(
        new Date(),
        dateFns.addMonths(new Date(user.usernameCoolDown), 1)
      )
    ) {
      return "You may only change your username once every month.";
    }
    if (await getUser(username)) {
      return "Username taken.";
    }

    user.usernameCoolDown = new Date();
    user.username = username;
    redirect = "/profile/" + username;
  }
  await collectionUsers.doc(user.id).set(user);
  $store.commit("localStorage/USER_UPDATE", user);
  if (redirect) {
    $app.router.push(redirect);
  }
}

let firestore;
let auth;
let fireModule;
let collectionUsers;
let $store;
let dateFns;
let $app;

export default ({ $fire, $fireModule, store, $dateFns, app }, inject) => {
  firestore = $fire.firestore;
  auth = $fire.auth;
  fireModule = $fireModule;
  collectionUsers = firestore.collection("users");
  $store = store;
  dateFns = $dateFns;
  $app = app;
  inject("register", register);
  inject("signIn", signIn);
  inject("getUser", getUser);
  inject("deleteUser", deleteUser);
  inject("updateUser", updateUser);
  inject("userExists", userExists);
};
