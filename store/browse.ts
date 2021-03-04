import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { $categories, $titles } from "~/plugins/search";

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
    return this.titles.map(title => title.t);
  }

  get titleFromRoute() {
    return (route: string) =>
      this.titles.find((title: any) => {
        const titleRouteParts = title.r.split("/");
        const routeParts = route.split("/");
        return titleRouteParts[1] === routeParts[1] &&
          titleRouteParts[2] === routeParts[2]
          ? title
          : null;
      });
  }

  get topSeries() {
    return this.titles
      .filter(title => title.u)
      .sort((a, b) => (a.p < b.p ? -1 : 1))
      .slice(0, 5);
  }

  @VuexMutation
  setTitles(titles: any[]): void {
    this.titles = titles;
  }

  @VuexMutation
  setCategories(categories: any): void {
    this.categories = categories;
  }

  @VuexAction({ rawError: true })
  async init(): Promise<void> {
    this.setTitles(await $titles.getDocuments({ limit: 1000000 }));
    this.setCategories(await $categories.getDocuments());
  }
}
