import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { docs } from "~/plugins/firebase";
import { $fire, $fireModule, $toast } from "~/utils/modules";

@Module({ name: "reviews", stateFactory: true, namespaced: true })
export default class ReviewsStore extends VuexModule {
  profile: any[] = [];
  latest: any[] = [];
  reviews: any[] = [];

  @VuexMutation
  setProfile(profile: any[]) {
    this.profile = profile;
  }

  @VuexMutation
  setLatest(latest: any[]) {
    this.latest = latest;
  }

  @VuexMutation
  setReviews(reviews: any[]) {
    this.reviews = reviews;
  }

  @VuexMutation
  add(review: any) {
    this.reviews.unshift(review);
  }

  @VuexMutation
  addLike({ id, idUser }: { id: string; idUser: string }): void {
    const review = this.reviews.find(review => review.id === id);
    review.likes.push(idUser);
  }

  @VuexMutation
  removeLike({ id, idUser }: { id: string; idUser: string }): void {
    const review = this.reviews.find(review => review.id === id);
    const index = review.likes.indexOf(idUser);
    review.likes.splice(index, 1);
  }

  @VuexMutation
  report({ id, idUser }: { id: string; idUser: string }): void {
    const review = this.reviews.find(review => review.id === id);
    review.reports.push(idUser);
  }

  @VuexAction({ rawError: true })
  async create(review: any) {
    if (review.content.length < 200 || review.content.length > 1000) {
      $toast.error("Your review needs between 200 and 1000 characters.");
      return;
    }
    const author = this.context.rootState.localStorage.user;
    const title = this.context.rootState.title.title;
    const data = {
      author: {
        id: author.id,
        username: author.username,
        image: author.image
      },
      title: {
        id: title.summary.id,
        type: title.summary.type,
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
    const ref = await $fire.firestore.collection("reviews").add(data);
    this.context.commit("add", data);

    data.id = ref.id;
    $fire.firestore
      .collection("users")
      .doc(author.id)
      .update({
        reviews: $fireModule.firestore.FieldValue.arrayUnion(data)
      });
    this.context.commit("localStorage/review", data, { root: true });
  }

  @VuexAction({ rawError: true, commit: "setLatest" })
  async getLatest(cookies: any) {
    const titles: any = this.context.rootState.browse.titles;
    const latest: any = await docs(
      $fire.firestore
        .collection("reviews")
        .orderBy("postedOn", "desc")
        .limit(3),
      "getReviewsLatest",
      cookies
    );
    if (process.client) {
      for (const review of latest) {
        const title: any = titles.find(
          (item: any) => item.id === String(review.title.id)
        );
        review.title.route = title.r;
      }
    }

    return latest;
  }

  @VuexAction({ rawError: true, commit: "setProfile" })
  async getProfile(username: string) {
    return await docs(
      $fire.firestore
        .collection("reviews")
        .where("author.username", "==", username)
    );
  }

  @VuexAction({ rawError: true, commit: "setReviews" })
  async get(id: string) {
    return (
      await docs(
        $fire.firestore
          .collection("reviews")
          .where("title.id", "==", Number(id)),
        "getReviews"
      )
    ).sort((a: any, b: any) => b.postedOn - a.postedOn);
  }

  @VuexAction({ rawError: true, commit: "addLike" })
  like(id: string) {
    const idUser = this.context.rootGetters["localStorage/id"];
    $fire.firestore
      .collection("reviews")
      .doc(id)
      .update({
        likes: $fireModule.firestore.FieldValue.arrayUnion(idUser)
      });
    return { id, idUser };
  }

  @VuexAction({ rawError: true, commit: "removeLike" })
  unlike(id: string) {
    const idUser = this.context.rootGetters["localStorage/id"];
    $fire.firestore
      .collection("reviews")
      .doc(id)
      .update({
        likes: $fireModule.firestore.FieldValue.arrayRemove(idUser)
      });
    return { id, idUser };
  }
}
