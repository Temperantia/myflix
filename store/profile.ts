import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { $getUser } from "~/plugins/auth";

@Module({ name: "profile", stateFactory: true, namespaced: true })
export default class ProfileStore extends VuexModule {
  profile: any = null;
  edition: boolean = false;

  get self() {
    return () => {
      const id = this.context.rootGetters["localStorage/id"];
      return id && this.profile && id === this.profile.id;
    };
  }

  get flixlist() {
    return Object.values(this.profile?.flixlist ?? []).sort((a: any, b: any) =>
      a.postedOn.seconds > b.postedOn.seconds ? -1 : 1
    );
  }

  get tvShows() {
    return Object.values(this.profile?.flixlist ?? []).filter(
      (element: any) => element.title.summary.type === "show"
    );
  }

  get tvShowsStats() {
    return [
      {
        name: "Watching",
        value: this.tvShowsWatching.length,
        class: "green-watching--text"
      },
      {
        name: "Completed",
        value: this.tvShowsCompleted.length,
        class: "blue-completed--text"
      },
      {
        name: "On-Hold",
        value: this.tvShowsOnHold.length,
        class: "yellow-on-hold--text"
      },
      {
        name: "Dropped",
        value: this.tvShowsDropped.length,
        class: "red-dropped--text"
      },
      {
        name: "Save for Later",
        value: this.tvShowsPlanToWatch.length,
        class: "grey-save-for-later--text"
      },
      { name: "Total Entries", value: this.tvShows.length },
      { name: "Episodes", value: this.tvShowsEpisodes }
    ];
  }

  get tvShowsChartData() {
    return this.tvShowsWatching.length ||
      this.tvShowsCompleted.length ||
      this.tvShowsOnHold.length ||
      this.tvShowsDropped.length ||
      this.tvShowsPlanToWatch.length
      ? {
          datasets: [
            {
              backgroundColor: [
                "#6dee76",
                "#576bec",
                "#f2921c",
                "#f51c1f",
                "#888888"
              ],
              data: [
                this.tvShowsWatching.length,
                this.tvShowsCompleted.length,
                this.tvShowsOnHold.length,
                this.tvShowsDropped.length,
                this.tvShowsPlanToWatch.length
              ]
            }
          ]
        }
      : {
          datasets: [
            {
              backgroundColor: ["#1b1b1b"],
              data: [1]
            }
          ]
        };
  }

  get tvShowsWatching() {
    return this.tvShows.filter((element: any) => element.status === "Watching");
  }

  get tvShowsCompleted() {
    return this.tvShows.filter(
      (element: any) => element.status === "Completed"
    );
  }

  get tvShowsOnHold() {
    return this.tvShows.filter((element: any) => element.status === "On-Hold");
  }

  get tvShowsDropped() {
    return this.tvShows.filter((element: any) => element.status === "Dropped");
  }

  get tvShowsPlanToWatch() {
    return this.tvShows.filter(
      (element: any) => element.status === "Save for Later"
    );
  }

  get tvShowsEpisodes() {
    return Number(
      this.tvShows.reduce(
        (sum: number, tvShow: any) => sum + tvShow.episodes,
        0
      )
    );
  }

  get tvShowsFavorites() {
    return this.profile?.favorites?.shows ?? [];
  }

  get films() {
    return Object.values(this.profile?.flixlist ?? []).filter(
      (element: any) => element.title.summary.type === "movie"
    );
  }

  get filmsStats() {
    return [
      {
        name: "Watching",
        value: this.filmsWatching.length,
        class: "green-watching--text"
      },
      {
        name: "Completed",
        value: this.filmsCompleted.length,
        class: "blue-completed--text"
      },
      {
        name: "On-Hold",
        value: this.filmsOnHold.length,
        class: "yellow-on-hold--text"
      },
      {
        name: "Dropped",
        value: this.filmsDropped.length,
        class: "red-dropped--text"
      },
      {
        name: "Save for Later",
        value: this.filmsPlanToWatch.length,
        class: "grey-save-for-later--text"
      },
      { name: "Total Entries", value: this.films.length }
    ];
  }

  get filmsChartData() {
    return this.filmsWatching.length ||
      this.filmsCompleted.length ||
      this.filmsOnHold.length ||
      this.filmsDropped.length ||
      this.filmsPlanToWatch.length
      ? {
          datasets: [
            {
              backgroundColor: [
                "#6dee76",
                "#576bec",
                "#f2921c",
                "#f51c1f",
                "#888888"
              ],
              data: [
                this.filmsWatching.length,
                this.filmsCompleted.length,
                this.filmsOnHold.length,
                this.filmsDropped.length,
                this.filmsPlanToWatch.length
              ]
            }
          ]
        }
      : {
          datasets: [
            {
              backgroundColor: ["#1b1b1b"],
              data: [1]
            }
          ]
        };
  }

  get filmsWatching() {
    return this.films.filter((element: any) => element.status === "Watching");
  }

  get filmsCompleted() {
    return this.films.filter((element: any) => element.status === "Completed");
  }

  get filmsOnHold() {
    return this.films.filter((element: any) => element.status === "On-Hold");
  }

  get filmsDropped() {
    return this.films.filter((element: any) => element.status === "Dropped");
  }

  get filmsPlanToWatch() {
    return this.films.filter(
      (element: any) => element.status === "Save for Later"
    );
  }

  get filmsFavorites() {
    return this.profile?.favorites?.films ?? [];
  }

  @VuexMutation
  setProfile(profile: any) {
    this.profile = profile;
    this.edition = false;
  }

  @VuexMutation
  setEdition(edition: boolean) {
    this.edition = edition;
  }

  @VuexAction({ commit: "setProfile" })
  async loadUsername(username: string) {
    if (this.profile?.username !== username) {
      let user = this.context.rootGetters["localStorage/user"];
      if (!user || username !== user.username) {
        user = await $getUser(username);
      }
      return user;
    }
    return this.profile;
  }
}
