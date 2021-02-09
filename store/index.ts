import { Store } from "vuex";
import { initialiseStores } from "~/utils/store-accessor";

const initializer = (store: Store<any>) => initialiseStores(store);

export const plugins = [initializer];
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION() {}
};
export * from "~/utils/store-accessor";
