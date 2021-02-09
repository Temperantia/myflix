import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { docs } from "~/plugins/firebase";
import { $fire } from "~/utils/modules";
import { openDB } from "idb";

@Module({ name: "browse", stateFactory: true, namespaced: true })
export default class BrowseStore extends VuexModule {
  titles: any[] = [];
  categories: any = {};

  get premieres() {
    return this.titles
      .filter(title => title.m)
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 10);
  }

  get trendingWeek() {
    return (isNewReleases: boolean) =>
      this.titles
        .filter(title => (isNewReleases ? title.n : title.w))
        .sort((a, b) => (a.p < b.p ? -1 : 1))
        .slice(0, 10);
  }

  get titleNames() {
    return this.titles.map(item => item.t);
  }

  get titleFromRoute() {
    return (route: string) => this.titles.find((item: any) => item.r === route);
  }

  get titleFromTitle() {
    return (title: string) => this.titles.find((item: any) => item.t === title);
  }

  get topSeries() {
    return this.titles
      .filter(title => title.u)
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 5);
  }

  @VuexMutation setTitles(titles: any[]): void {
    this.titles = titles;
  }

  @VuexMutation setCategories(categories: any): void {
    this.categories = categories;
  }

  @VuexAction({ rawError: true })
  async init(cookies: any): Promise<void> {
    if (process.server) {
      return;
    }
    const db = await openDB("Titles", 1, {
      upgrade(db) {
        db.createObjectStore("titles", {
          keyPath: "id"
        });
      }
    });
    let titles: any;
    if (cookies.get("getSearch")) {
      titles = await db.getAll("titles");
    } else {
      titles = (await docs($fire.firestore.collection("data")))
        .reduce(
          (data: any, current: any) => [...data, ...JSON.parse(current.search)],
          []
        )
        .filter((title: any) => {
          if (title.y === 0 || title.y >= 2030) {
            return false;
          }
          return !title.title;
        })
        .map((title: any) => {
          if (title.u && !title.s) {
            title.s = 1;
          }
          return title;
        });
      cookies.set("getSearch", true, { maxAge: 60 * 60 * 24 });
      const tx = db.transaction("titles", "readwrite");
      const promises: any = titles.map((title: any) => tx.store.put(title));
      promises.push(tx.done);
      await Promise.all(promises);
    }

    this.setTitles(titles);
    let categories: any = {};
    for (const item of titles) {
      for (const category of item.c) {
        if (categories[category]) {
          categories[category].value++;
        } else {
          categories[category] = {
            category: category,
            value: 1,
            image: item.b
          };
        }
      }
    }
    this.setCategories(
      Object.values(categories)
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 3)
    );
  }
}
