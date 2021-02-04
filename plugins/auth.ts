import { Context } from "@nuxt/types";
import { doc, docs } from "./firebase";

declare module "vue/types/vue" {
  interface Vue {
    $userExists(id: string, provider?: any): Promise<any>;
    $getUser(username: string): Promise<any>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $userExists(id: string, provider?: string): Promise<any>;
    $getUser(username: string): Promise<any>;
  }
  interface Context {
    $userExists(id: string, provider?: string): Promise<any>;
    $getUser(username: string): Promise<any>;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $userExists(id: string, provider?: string): Promise<any>;
    $getUser(username: string): Promise<any>;
  }
}

let $userExists: (id: string, provider?: string) => Promise<any>;
let $getUser: (username: string) => Promise<any>;

export default ({ $fire }: Context) => {
  const collectionUsers = $fire.firestore.collection("users");

  async function userExists(id: string, provider?: string) {
    if (provider) {
      const user = await docs(
        collectionUsers.where("providers." + provider + ".id", "==", id)
      );
      if (user.length === 0) {
        return null;
      }

      return user[0];
    }
    return await doc(collectionUsers.doc(id));
  }

  async function getUser(username: string): Promise<any> {
    const user = await docs(
      collectionUsers.where("usernameLower", "==", username.toLowerCase())
    );
    if (user.length === 0) {
      return null;
    }

    return user[0];
  }

  $userExists = userExists;
  $getUser = getUser;
};

export { $userExists, $getUser };
