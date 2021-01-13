import { doc, get } from "./firebase";

export default ({ $fire, $fireModule, store, $dateFns, app }, inject) => {
  const collectionUsers = $fire.firestore.collection("users");

  async function userExists(id, provider) {
    if (provider) {
      const user = await get(
        collectionUsers.where("providers." + provider + ".id", "==", id)
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
      const id = $fire.auth.currentUser.uid;
      let userCheck;
      try {
        userCheck = await $fire.auth.signInWithEmailAndPassword(
          email,
          password
        );
      } catch (error) {
        if (error || userCheck.uid !== id) {
          $toast.error("Incorrect Email or Password");
        }
      }
    }

    const user = await doc(collectionUsers.doc($fire.auth.currentUser.uid));
    await collectionUsers.doc(user.id).delete();
    for (const name in user.providers) {
      const provider = user.providers[name];
      if (provider.id !== user.id) {
        let cred;
        if (name === "google") {
          cred = new $fireModule.auth.GoogleAuthProvider.credential(
            null,
            provider.token
          );
        } else if (name === "facebook") {
          cred = new $fireModule.auth.FacebookAuthProvider.credential(
            provider.token
          );
        }
        await $fire.auth.signInWithCredential(cred);
        await $fire.auth.currentUser.delete();
      }
    }

    if (email && password) {
      await $fire.auth.signInWithEmailAndPassword(email, password);
      await $fire.auth.currentUser.delete();
    }

    store.commit("localStorage/USER_LOGOUT");
    app.router.push("/");
  }

  async function signIn(id, provider) {
    const user = await userExists(id, provider);
    if (user) {
      store.commit("localStorage/USER_LOGIN", user);
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
      favorites: { films: {}, shows: {} },
      created: $fireModule.firestore.Timestamp.now(),
      providers: {}
    };

    if (provider) {
      user.providers[provider] = { id, token };
    }

    await collectionUsers.doc(id).set(user);
    store.commit("localStorage/USER_LOGIN", { id, ...user });
    app.router.push("/");
  }

  async function updateUser(
    user,
    passwordNew,
    passwordCurrent,
    email,
    username
  ) {
    let redirect;
    if (passwordNew || email) {
      const data = await doc(collectionUsers.doc(user.id));
      try {
        await auth.signInWithEmailAndPassword(data.email, passwordCurrent);
      } catch (error) {
        $toast.error("Incorrect Password");
        return false;
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
        $dateFns.isBefore(
          new Date(),
          $dateFns.addMonths(new Date(user.usernameCoolDown), 1)
        )
      ) {
        $toast.error("You may only change your username once every month.");
        return false;
      }
      if (await getUser(username)) {
        $toast.error("Username taken.");
        return false;
      }

      user.usernameCoolDown = new Date();
      user.username = username;
      redirect = "/profile/" + username;
    }
    await collectionUsers.doc(user.id).set(user);
    store.commit("localStorage/USER_UPDATE", user);
    if (redirect) {
      app.router.push(redirect);
    }
  }

  inject("register", register);
  inject("signIn", signIn);
  inject("getUser", getUser);
  inject("deleteUser", deleteUser);
  inject("updateUser", updateUser);
  inject("userExists", userExists);
};
