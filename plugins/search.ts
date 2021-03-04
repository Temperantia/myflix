import { Index, MeiliSearch } from "meilisearch";

declare module "vue/types/vue" {
  interface Vue {
    $titles: Index<any>;
    $categories: Index<any>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $titles: Index<any>;
    $categories: Index<any>;
  }
  interface Context {
    $titles: Index<any>;
    $categories: Index<any>;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $titles: Index<any>;
    $categories: Index<any>;
  }
}

let $titles: any;
let $categories: any;

export default (_: any, inject: any) => {
  const client = new MeiliSearch({
    host: "https://search.my-flix.net"
  });

  $titles = client.index("videos");
  $categories = client.index("categories");

  inject("titles", $titles);
  inject("categories", $categories);
};

export { $titles, $categories };
