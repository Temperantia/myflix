import {
  VuexModule,
  VuexMutation,
  VuexAction,
  Module
} from "nuxt-property-decorator";
import { docs } from "~/plugins/firebase";
import { $fire, $fireModule } from "~/utils/modules";
import { openDB } from "idb";
import { inflate } from "pako";

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
        db.createObjectStore("categories", {
          keyPath: "category"
        });
      }
    });
    let titles: any;
    let categories: any = {};
    if (cookies.get("getSearch")) {
      titles = await db.getAll("titles");
      categories = await db.getAll("categories");
    } else {
      titles = await docs($fire.firestore.collection("data"));
      titles = (
        await titles.reduce(async (data: any, current: any) => {
          const base64 = (await new Response(current.search).text())
            .split(":")[1]
            .split(")")[0];
          const byteArray = inflate(
            $fireModule.firestore.Blob.fromBase64String(base64).toUint8Array()
          );
          let result = "";
          for (let i = 0; i < byteArray.length; i++) {
            result += String.fromCharCode(byteArray[i]);
          }

          return [...(await data), ...JSON.parse(result)];
        }, [])
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
      cookies.set("getSearch", true, { maxAge: 60 * 60 * 24 });

      let tx: any;
      let promises: any;
      tx = db.transaction("titles", "readwrite");
      promises = titles.map((title: any) => tx.store.put(title));
      promises.push(tx.done);
      await Promise.all(promises);

      tx = db.transaction("categories", "readwrite");
      promises = Object.values(categories)
        .sort((a: any, b: any) => b.value - a.value)
        .map((category: any) => tx.store.put(category));
      promises.push(tx.done);
      await Promise.all(promises);
    }
    this.setTitles(titles);
    this.setCategories(Object.values(categories).slice(0, 3));
  }
}
