import { Store } from "vuex";
import { initialiseStores } from "~/utils/store-accessor";

const initializer = (store: Store<any>) => initialiseStores(store);

export const plugins = [initializer];
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION() {}
};
export const actions = {
  async nuxtServerInit({ dispatch }: { dispatch: any }) {
    await dispatch("browse/init");
    await dispatch("reviews/getLatest");
    await dispatch("suggestions/getLatest");
  }
};
export * from "~/utils/store-accessor";
