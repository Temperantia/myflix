import {
  VuexModule,
  VuexAction,
  Module,
  VuexMutation
} from "nuxt-property-decorator";
import { $categories, $titles } from "~/plugins/search";

@Module({ name: "browse", stateFactory: true, namespaced: true })
export default class BrowseStore extends VuexModule {
  categories: any = {};
  premieres: any[] = [];
  trendingWeek: any[] = [];
  topSeries: any[] = [];

  @VuexMutation
  setPremieres(premieres: any) {
    this.premieres = premieres;
  }

  @VuexMutation
  setTrendingWeek(trendingWeek: any) {
    this.trendingWeek = trendingWeek;
  }

  @VuexMutation
  setTopSeries(topSeries: any) {
    this.topSeries = topSeries;
  }

  @VuexMutation
  setCategories(categories: any) {
    this.categories = categories;
  }

  @VuexAction({ rawError: true })
  async init(): Promise<void> {
    this.setPremieres(
      (await $titles.search(null, { filters: "monthRank<=10" })).hits
    );
    this.setTrendingWeek(
      (
        await $titles.search(null, {
          filters: "newReleasesRank<=10"
        })
      ).hits
    );
    this.setTopSeries(
      (await $titles.search(null, { filters: "topSeriesRank<=5" })).hits
    );
    this.setCategories(await $categories.getDocuments());
  }
}
