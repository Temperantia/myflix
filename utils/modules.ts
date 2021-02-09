import { NuxtFireInstance } from "@nuxtjs/firebase";
import Firebase from "firebase";
import Moment from "moment";
import { Toasted } from "vue-toasted";
import { NuxtAppOptions } from "@nuxt/types";
import { Route } from "vue-router";

let $fire: NuxtFireInstance;
let $fireModule: typeof Firebase;
let $toast: Toasted;
let $router;
const $moment: typeof Moment = Moment;
let $route: Route;
let $redirect: any;

export function initialize(
  fire: NuxtFireInstance,
  fireModule: typeof Firebase,
  app: NuxtAppOptions,
  route: Route,
  redirect: any
) {
  $fire = fire;
  $fireModule = fireModule;
  $toast = app.$toast;
  $router = app.router;
  $route = route;
  $redirect = redirect;
}

export { $fire, $fireModule, $toast, $router, $moment, $route, $redirect };
