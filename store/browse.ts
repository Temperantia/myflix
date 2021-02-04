import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { docs } from "~/plugins/firebase";
import { $fire } from "~/utils/modules";

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

  @VuexAction({ rawError: true }) async init(): Promise<void> {
    this.setTitles(
      (await docs($fire.firestore.collection("data"), "getSearch"))
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
        })
    );

    let categories: any = {};
    for (const item of this.titles) {
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
