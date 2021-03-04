import { doc } from "~/plugins/firebase";
import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import {
  $fire,
  $fireModule,
  $toast,
  $moment,
  $redirect
} from "~/utils/modules";
import { $titles } from "~/plugins/search";

@Module({ name: "title", stateFactory: true, namespaced: true })
export default class TitleStore extends VuexModule {
  title: any = null;
  status: string = "";
  episodes: number = 0;
  score: string = "";
  bingeworthy = false;
  saved = false;
  suggestions: any[] = [];
  maturities: string[] = ["TV-Y7", "G", "PG", "PG-13", "TV-MA"];
  ratings: any = {
    10: "Phenomenal",
    9: "Amazing",
    8: "Great",
    7: "Good",
    6: "Decent",
    5: "Mediocre",
    4: "Poor",
    3: "Bad",
    2: "Awful",
    1: "Atrocious"
  };
  statusesTvShow: string[] = [
    "Watching",
    "Dropped",
    "Save for Later",
    "On-Hold",
    "Completed"
  ];

  get id() {
    return this.title?.id;
  }

  @VuexMutation
  setTitle(title: any) {
    this.title = title;
  }

  @VuexMutation
  setStatus(status: string) {
    this.status = status;
    this.saved = false;
  }

  @VuexMutation
  setEpisodes(episodes: number) {
    this.episodes = episodes;
    this.saved = false;
  }

  @VuexMutation
  setScore(score: string) {
    this.score = score;
    this.saved = false;
  }

  @VuexMutation
  setBingeworthy(bingeworthy: boolean) {
    this.bingeworthy = bingeworthy;
    this.saved = false;
  }

  @VuexMutation
  setSaved(saved: boolean) {
    this.saved = saved;
  }

  @VuexMutation
  updateStatus(value: string) {
    if (value === "Remove from List") {
      this.status = "";
      return;
    }
    this.status = value;
    if (this.title.summary.type === "show") {
      if (this.status === "Completed") {
        this.episodes = this.title.episodeCount;
      } else if (!this.status || this.episodes === this.title.episodeCount) {
        this.episodes = 0;
      }
    }
  }

  @VuexMutation
  updateEpisodes(value: number) {
    if (value <= 0) {
      this.episodes = 0;
      this.status = "";
    } else if (value >= this.title.episodeCount) {
      this.episodes = this.title.episodeCount;
      this.status = "Completed";
    } else {
      this.episodes = value;
      if (this.status === "Completed" || !this.status) {
        this.status = "Watching";
      }
    }
  }

  @VuexAction({ rawError: true })
  async redirect({ route }: any) {
    const routeParts = route.path.split("/");
    const r =
      "'/" + routeParts[1] + "/" + routeParts[2] + "/" + routeParts[3] + "'";
    const hits = (await $titles.search(null, { filters: "r=" + r })).hits;
    if (!hits) {
      return $redirect("/");
    }
    await this.get(hits[0].id);
  }

  @VuexAction({ rawError: true })
  async update(): Promise<void> {
    if (this.saved) {
      return;
    }
    if (!this.status) {
      $toast.error("Select a status");
      return;
    }
    const idUser = this.context.rootGetters["localStorage/id"];
    const data = {
      status: this.status,
      episodes: this.episodes,
      score: Number(this.score.split("-")[0]),
      bingeworthy: this.bingeworthy,
      title: {
        id: this.title.id,
        title: this.title.title,
        summary: this.title.summary,
        Poster: this.title.Poster,
        releaseYear: this.title.releaseYear,
        maturity: this.title.maturity,
        episodeCount: this.title.episodeCount
      },
      postedOn: $fireModule.firestore.Timestamp.now()
    };

    $fire.firestore
      .collection("users")
      .doc(idUser)
      .update({ [`flixlist.${this.title.id}`]: data });
    this.context.commit(
      "localStorage/setFlixlist",
      {
        idTitle: this.title.id,
        data
      },
      { root: true }
    );

    const video: any = { ["followers." + idUser]: new Date() };
    if (this.score) {
      video["scores." + idUser] = Number(this.score.split("-")[0]);
    }
    video.bingeworthiness = this.bingeworthy
      ? $fireModule.firestore.FieldValue.arrayUnion(idUser)
      : $fireModule.firestore.FieldValue.arrayRemove(idUser);
    $fire.firestore
      .collection("videos")
      .doc(this.title.id)
      .update(video);
    this.setSaved(true);
    $toast.success("Flixlist updated");
  }

  @VuexAction({ rawError: true })
  loadFlixlist(id: string) {
    const flixlist: any = this.context.rootGetters["localStorage/flixlist"]?.[
      id
    ];
    if (!flixlist) {
      return;
    }
    this.setStatus(flixlist.status ?? "");
    this.setEpisodes(flixlist.episodes ?? 0);
    this.setScore(
      flixlist.score
        ? `${flixlist.score} - ${this.ratings[flixlist.score]}`
        : ""
    );
    this.setBingeworthy(!!flixlist.bingeworthy);
  }

  @VuexAction({ rawError: true, commit: "setTitle" })
  public async get(id: string) {
    const query = $fire.firestore.collection("videos").doc(id);
    const title: any = await doc(query);
    const numUsers = String(Object.keys(title.scores).length);
    const information: any = {
      Type: title.summary.type === "show" ? "TV Show" : "Movie",
      Premiered: title.availability.availabilityStartTime
        ? $moment(title.availability.availabilityStartTime).format(
            "MMM d, yyyy"
          )
        : null,
      Producers: title.creators.join(", "),
      Genres: title.genres.map((genre: any) => genre.name).join(", "),
      Rating: title.maturity
    };
    if (title.summary.type === "show") {
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
      information.Rating = "PG";
    } else {
      information.Rating = this.maturities[title.maturity];
    }

    this.context.dispatch("loadFlixlist", id);
    this.context.dispatch("reviews/get", id, { root: true });
    this.context.dispatch("suggestions/get", id, { root: true });
    return {
      ...title,
      information,
      statistics,
      numUsers
    };
  }
}
