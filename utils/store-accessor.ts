import { Store } from "vuex";
import { getModule } from "nuxt-property-decorator";
import Browse from "~/store/browse";
import Title from "~/store/title";
import Profile from "~/store/profile";
import Reviews from "~/store/reviews";
import Suggestions from "~/store/suggestions";
import LocalStorage from "~/store/localStorage";

let browseStore: Browse;
let titleStore: Title;
let profileStore: Profile;
let reviewsStore: Reviews;
let suggestionsStore: Suggestions;
let localStorageStore: LocalStorage;

function initialiseStores(store: Store<any>): void {
  browseStore = getModule(Browse, store);
  titleStore = getModule(Title, store);
  profileStore = getModule(Profile, store);
  reviewsStore = getModule(Reviews, store);
  suggestionsStore = getModule(Suggestions, store);
  localStorageStore = getModule(LocalStorage, store);
}

export { initialiseStores };
