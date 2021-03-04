import firebase from "firebase";

function parse(doc: firebase.firestore.DocumentSnapshot) {
  return { id: doc.id, ...doc.data() };
}

declare module "vue/types/vue" {
  interface Vue {
    $globals: any;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $globals: any;
  }
  interface Context {
    $globals: any;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $globals: any;
  }
}

export async function docs(
  query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  name?: string | undefined,
  cookies?: any
) {
  /*  const cache = await query.get({ source: "cache" });
  if (!name || (name && cookies && !cookies.get(name))) { */
  const data = await query.get({ source: "server" });
  /* if (name) {
      cookies.set(name, true, { maxAge: 60 * 60 * 24 });
    } */
  return data.docs.map((doc: any) => parse(doc));
  /*  }
  return cache.docs.map((doc: any) => parse(doc)); */
}

export async function doc(query: any, name?: string) {
  const data = await query.get({ source: "server" });
  return parse(data);
}

const maturitiesEurope = {
  AL: "G",
  "Kids OK": "TV-Y7",
  6: "TV-Y7",
  9: "PG",
  12: "PG-13",
  14: "PG-13",
  16: "TV-MA",
  18: "TV-MA"
};

//const statusesFilm = ["Save for Later", "Completed", "Rewatched", "Unfinished"];

function titleStatusColor(status: string): string {
  if (status === "Watching") {
    return "green-watching--text";
  } else if (status === "Dropped") {
    return "red-dropped--text";
  } else if (status === "Save for Later") {
    return "grey-save-for-later--text";
  } else if (status === "On-Hold") {
    return "yellow-on-hold--text";
  } else if (status === "Completed") {
    return "blue-completed--text";
  }
  return "grey-button--text";
}

function statusColor(status: string): string {
  if (status === "Watching") {
    return "green-watching";
  } else if (status === "Dropped") {
    return "red-dropped";
  } else if (status === "Save for Later") {
    return "grey-save-for-later";
  } else if (status === "On-Hold") {
    return "yellow-on-hold";
  } else if (status === "Completed") {
    return "blue-completed";
  }
  return "grey-button";
}

export default async ({ $fire, $fireModule, store }: any, inject: any) => {
  const firestore = $fire.firestore;
  const collectionGlobals = firestore.collection("globals");

  async function getGlobals() {
    const globals: any = await doc(collectionGlobals.doc("globals"));
    let contentRequests: any[] = [];
    for (const idsUser of Object.values(globals.contentRequests)) {
      contentRequests = [...contentRequests, ...(idsUser as any)];
    }
    globals.contentRequests = contentRequests;
    return globals;
  }

  function requestContent(country: string): void {
    const idUser = store.getters["localStorage/id"];
    collectionGlobals.doc("globals").update({
      ["contentRequests." +
      country]: $fireModule.firestore.FieldValue.arrayUnion(idUser)
    });
  }

  const globals = await getGlobals();

  inject("titleStatusColor", titleStatusColor);
  inject("statusColor", statusColor);
  inject("requestContent", requestContent);
  inject("globals", globals);
  return { doc, docs };
};
