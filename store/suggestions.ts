import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { docs } from "~/plugins/firebase";
import { $fire, $fireModule, $toast } from "~/utils/modules";

@Module({ name: "suggestions", stateFactory: true, namespaced: true })
export default class SuggestionsStore extends VuexModule {
  profile: any[] = [];
  latest: any[] = [];
  suggestions: any[] = [];

  @VuexMutation setProfile(profile: any[]) {
    this.profile = profile;
  }

  @VuexMutation setLatest(latest: any[]) {
    this.latest = latest;
  }

  @VuexMutation setSuggestions(suggestions: any[]) {
    this.suggestions = suggestions;
  }

  @VuexMutation add(review: any) {
    this.suggestions.unshift(review);
  }

  @VuexAction({ rawError: true })
  async create(suggestion: any) {
    if (!suggestion.similar) {
      $toast.error("You need to pick a similar title");
      return;
    }
    if (suggestion.content.length < 200 || suggestion.content.length > 1000) {
      $toast.error("Your suggestion needs between 200 and 1000 characters.");
      return;
    }
    const author = this.context.rootState.localStorage.user;
    const title = this.context.rootState.title.title;
    const titles: any = this.context.rootState.browse.titles;
    const t: any = titles.find((title: any) => title.id === String(title.id));
    const s: any = titles.find((title: any) => suggestion.similar.id === String(title.id));
    suggestion.similar.route = s.r;
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
        route: t.r,
        boxArt: title.boxArt,
        Poster: title.Poster
      },
      ...suggestion,
      reports: [],
      postedOn: $fireModule.firestore.Timestamp.now()
    };
    const ref = await $fire.firestore.collection("suggestions").add(data);
    this.context.commit("add", data);

    data.id = ref.id;
    $fire.firestore
      .collection("users")
      .doc(author.id)
      .update({
        suggestions: $fireModule.firestore.FieldValue.arrayUnion(data)
      });
    this.context.commit("localStorage/suggestion", data, { root: true });
  }

  @VuexAction({ rawError: true, commit: "setLatest" })
  async getLatest(cookies: any) {
    const latest: any = (
      await docs(
        $fire.firestore
          .collection("suggestions")
          .orderBy("postedOn", "desc")
          .limit(3),
        "getSuggestionsLatest",
        cookies
      )
    ).filter((suggestion: any) => !suggestion.banned);

    return latest;
  }

  @VuexAction({ rawError: true, commit: "setProfile" })
  async getProfile(username: string) {
    return (
      await docs(
        $fire.firestore
          .collection("suggestions")
          .where("author.username", "==", username)
      )
    ).filter((suggestion: any) => !suggestion.banned);
  }

  @VuexAction({ rawError: true, commit: "setSuggestions" }) async get(
    id: string
  ) {
    return (
      await docs(
        $fire.firestore
          .collection("suggestions")
          .where("title.id", "==", Number(id)),
        "getSuggestions"
      )
    )
      .filter((suggestion: any) => !suggestion.banned)
      .sort((a: any, b: any) => b.postedOn - a.postedOn);
  }

  @VuexAction({ rawError: true })
  report(suggestion: any) {
    const idUser = this.context.rootGetters["localStorage/id"];
    const update: any = {
      reports: $fireModule.firestore.FieldValue.arrayUnion(idUser)
    };
    if (suggestion.reports.length >= 9) {
      update.banned = true;
    }
    $fire.firestore
      .collection("suggestions")
      .doc(suggestion.id)
      .update(update);
  }
}
