import Vue from "vue";
import {
  VuexModule,
  VuexMutation,
  Module,
  VuexAction
} from "nuxt-property-decorator";
import { $fire, $fireModule, $moment, $router, $toast } from "~/utils/modules";
import { doc } from "~/plugins/firebase";
import { $getUser, $userExists } from "~/plugins/auth";

@Module({ name: "localStorage", stateFactory: true, namespaced: true })
export default class localStorageStore extends VuexModule {
  user: any = null;
  connected: boolean = false;
  socialAuthUser: any = null;
  titles: any = [];

  get id() {
    return this.user?.id;
  }

  get flixlist() {
    return this.user?.flixlist;
  }

  get titleStatus() {
    return (idTitle: string) => this.flixlist?.[idTitle]?.status;
  }

  get episodes() {
    return (idTitle: string) => this.flixlist?.[idTitle]?.episodes;
  }

  get favorites() {
    return this.user?.favorites;
  }

  @VuexMutation setSocialAuthUser(socialAuthUser: any) {
    this.socialAuthUser = socialAuthUser;
  }

  @VuexMutation _signIn(user: any) {
    this.user = user;
    this.connected = true;
  }

  @VuexMutation _signOut() {
    this.user = null;
    this.connected = false;
  }

  @VuexMutation _update(user: any) {
    this.user = user;
  }

  @VuexMutation review(review: any) {
    this.user.reviews.push(review);
  }

  @VuexMutation suggestion(suggestion: any) {
    this.user.suggestions.push(suggestion);
  }

  @VuexMutation setFlixlist({ idTitle, data }: { idTitle: string; data: any }) {
    Vue.set(this.user.flixlist, idTitle, data);
  }

  @VuexMutation
  _addToFlixlist(data: any) {
    Vue.set(this.user.flixlist, data.title.id, data);
  }

  @VuexMutation
  _removeFromFlixlist(idTitle: string) {
    Vue.delete(this.user.flixlist, idTitle);
  }

  @VuexMutation _addFavorite({
    type,
    favorite
  }: {
    type: string;
    favorite: any;
  }) {
    Vue.set(this.user.favorites, type, favorite);
  }

  @VuexMutation _removeFavorite({ type, id }: { type: string; id: string }) {
    Vue.delete(this.user.favorites[type], id);
  }

  @VuexAction({ rawError: true })
  async signIn({
    name,
    provider,
    email,
    password
  }: {
    name?: string;
    provider?: any;
    email?: string;
    password?: string;
  }) {
    try {
      const cred: any = await (provider
        ? $fire.auth.signInWithPopup(provider)
        : $fire.auth.signInWithEmailAndPassword(
            email as string,
            password as string
          ));

      const id = cred.user.uid;
      const user = await $userExists(id, name);
      if (user) {
        $router.push("/");
        this.context.commit("_signIn", user);
      } else if (provider) {
        this.setSocialAuthUser({
          id,
          email: cred.user.email,
          image: cred.user.photoURL,
          provider: name,
          token: cred.credential.accessToken
        });
      }
    } catch (error) {
      $toast.error(provider ? error : "Incorrect Email or Password");
    }
  }

  @VuexAction({ rawError: true })
  signInWithGoogle() {
    const provider = new $fireModule.auth.GoogleAuthProvider();
    this.signIn({ name: "google", provider });
  }

  @VuexAction({ rawError: true })
  signInWithFacebook() {
    const provider = new $fireModule.auth.FacebookAuthProvider();
    this.signIn({ name: "facebook", provider });
  }

  @VuexAction({ rawError: true })
  signInWithApple() {
    const provider = new $fireModule.auth.OAuthProvider("apple.com");
    this.signIn({ name: "apple", provider });
  }

  @VuexAction({ rawError: true, commit: "_signIn" })
  async register({
    id,
    email,
    username,
    password,
    photoURL,
    provider,
    token
  }: {
    id: string;
    email: string;
    username: string;
    password: string;
    photoURL: string;
    provider: string;
    token: string;
  }): Promise<void> {
    const exists = await $getUser(username);
    if (exists) {
      $toast.error("Username is taken");
      return;
    }

    if (!provider) {
      const cred = await $fire.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      id = cred.user?.uid as string;
    }
    const user: any = {
      email,
      username,
      usernameLower: username.toLowerCase(),
      usernameCoolDown: new Date(),
      image: photoURL ?? null,
      reviews: [],
      suggestions: [],
      flixlist: {},
      favorites: { films: {}, shows: {} },
      created: $fireModule.firestore.Timestamp.now(),
      providers: {}
    };

    if (provider) {
      user.providers[provider] = { id, token };
    }

    await $fire.firestore
      .collection("users")
      .doc(id)
      .set(user);
    $router.push("/");
    return { id, ...user };
  }

  @VuexAction({ rawError: true })
  async update({ user, passwordNew, passwordCurrent, email, username }: any) {
    let redirect;
    if (passwordNew || email) {
      const data: any = await doc(
        $fire.firestore.collection("users").doc(user.id)
      );
      try {
        await $fire.auth.signInWithEmailAndPassword(
          data.email,
          passwordCurrent
        );
      } catch (error) {
        $toast.error("Incorrect Password");
        return;
      }

      if (passwordNew) {
        await $fire.auth.currentUser?.updatePassword(passwordNew);
      }
      if (email) {
        await $fire.auth.currentUser?.updateEmail(email);
        user.email = email;
      }
    }

    if (username) {
      if ($moment().isBefore($moment(user.usernameCoolDown).add(1, "M"))) {
        $toast.error("You may only change your username once every month.");
        return;
      }
      if (await $getUser(username)) {
        $toast.error("Username taken.");
        return;
      }

      user.usernameCoolDown = new Date();
      user.username = username;
      user.usernameLower = username.toLowerCase();
      redirect = "/profile/" + user.usernameLower;
    }
    await $fire.firestore
      .collection("users")
      .doc(user.id)
      .set(user);
    await $fire.firestore
      .collection("globals")
      .doc("newsletters")
      .set(
        {
          marketing: {
            product: user.notifications.marketing.product
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email),
            survey: user.notifications.marketing.survey
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email),
            partner: user.notifications.marketing.partner
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email),
            missed: user.notifications.marketing.missed
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email)
          },
          notification: {
            dm: user.notifications.notification.dm
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email),
            friend: user.notifications.notification.friend
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email),
            suggestion: user.notifications.notification.suggestion
              ? $fireModule.firestore.FieldValue.arrayUnion(user.email)
              : $fireModule.firestore.FieldValue.arrayRemove(user.email)
          }
        },
        { merge: true }
      );

    $toast.success("Profile updated");
    this.context.commit("_update", user);
    this.context.commit("profile/setProfile", user, { root: true });
    if (redirect) {
      $router.push(redirect);
    }
  }

  @VuexAction({ rawError: true, commit: "_signOut" })
  async signOut() {
    await $fire.auth.signOut();
    $router.push("/");
  }

  @VuexAction({ rawError: true, commit: "_signOut" })
  async delete({ email, password }: { email: string; password: string }) {
    if (email && password) {
      const id = $fire.auth.currentUser?.uid;
      let userCheck;
      try {
        userCheck = await $fire.auth.signInWithEmailAndPassword(
          email,
          password
        );
      } catch (error) {
        if (error || userCheck?.user?.uid !== id) {
          $toast.error("Incorrect Email or Password");
        }
      }
    }

    const user: any = await doc(
      $fire.firestore.collection("users").doc($fire.auth.currentUser?.uid)
    );
    await $fire.firestore
      .collection("users")
      .doc(user.id)
      .delete();
    for (const name in user.providers) {
      const provider = user.providers[name];
      if (provider.id !== user.id) {
        let cred: any;
        if (name === "google") {
          cred = $fireModule.auth.GoogleAuthProvider.credential(
            null,
            provider.token
          );
        } else if (name === "facebook") {
          cred = $fireModule.auth.FacebookAuthProvider.credential(
            provider.token
          );
        }
        await $fire.auth.signInWithCredential(cred);
        await $fire.auth.currentUser?.delete();
      }
    }

    if (email && password) {
      await $fire.auth.signInWithEmailAndPassword(email, password);
      await $fire.auth.currentUser?.delete();
    }

    $router.push("/");
  }

  @VuexAction({ rawError: true, commit: "_addToFlixlist" })
  addToFlixlist(title: any) {
    const data = {
      status: "Save for Later",
      title: {
        id: title.id,
        title: title.t,
        summary: { type: title.u ? "show" : "movie" },
        Poster: title.i ?? title.b,
        releaseYear: title.y,
        maturity: title.v,
        episodeCount: title.e ?? null
      },
      postedOn: $fireModule.firestore.Timestamp.now()
    };

    $fire.firestore
      .collection("users")
      .doc(this.id)
      .update({ [`flixlist.${title.id}`]: data });
    return data;
  }

  @VuexAction({ rawError: true, commit: "_removeFromFlixlist" })
  removeFromFlixlist(idTitle: string) {
    $fire.firestore
      .collection("users")
      .doc(this.id)
      .update({
        [`flixlist.${idTitle}`]: $fireModule.firestore.FieldValue.delete()
      });
    return idTitle;
  }

  @VuexAction({ rawError: true, commit: "_addFavorite" })
  addFavorite() {
    const title = this.context.rootState.title.title;
    const type = title.summary.type === "show" ? "shows" : "films";
    const favorite = {
      [title.id]: {
        image: title.Poster ?? title.boxArt,
        title: title.title,
        year: title.releaseYear,
        maturity: title.maturity ? title.maturity : null,
        season: title.seasonCount ? title.seasonCount : 1,
        genres: title.genres
      }
    };
    $fire.firestore
      .collection("users")
      .doc(this.id)
      .set(
        {
          favorites: {
            [type]: favorite
          }
        },
        { merge: true }
      );

    $fire.firestore
      .collection("videos")
      .doc(title.id)
      .set(
        {
          favorites: $fireModule.firestore.FieldValue.arrayUnion(this.id)
        },
        { merge: true }
      );

    return { type, favorite };
  }

  @VuexAction({ rawError: true, commit: "_removeFavorite" })
  removeFavorite() {
    const title = this.context.rootState.title.title;
    const type = title.summary.type === "show" ? "shows" : "films";
    $fire.firestore
      .collection("users")
      .doc(this.id)
      .update({
        ["favorites." +
        type +
        "." +
        title.id]: $fireModule.firestore.FieldValue.delete()
      });

    $fire.firestore
      .collection("videos")
      .doc(title.id)
      .set(
        {
          favorites: $fireModule.firestore.FieldValue.arrayRemove(this.id)
        },
        { merge: true }
      );
    return { type, id: title.id };
  }
}
