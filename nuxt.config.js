export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "server",
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - myflix",
    title: "myflix",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["@/assets/main.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/firebase",
    "~/plugins/auth",
    { src: "~/plugins/vue-toasted", mode: "client" },
    { src: "~/plugins/vue-scrollactive", mode: "client" }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/date-fns",
    "nuxt-webfontloader",
    "@nuxtjs/style-resources"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyAZ4mK0FX2Iaj656xIGONrv0iTISDreNY8",
          authDomain: "my-flix-91e46.firebaseapp.com",
          databaseURL: "https://my-flix-91e46.firebaseio.com/",
          projectId: "my-flix-91e46",
          storageBucket: "my-flix-91e46.appspot.com",
          messagingSenderId: "586880609683",
          appId: "1:586880609683:web:0cbcb01a1db9121152cc66",
          measurementId: "G-QG7LKFWBJR"
        },
        services: {
          firestore: {
            enablePersistence: true
          },
          auth: true
        },
        onFirebaseHosting: true
      }
    ],
    ["nuxt-vuex-localstorage"],
    "@nuxtjs/google-adsense"
  ],
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#e30914",
          blackHeader: "#191919",
          "black-subheader": "#252525",
          blackBody: "#141414",
          greyButton: "#363636",
          grey: "#828282",
          "red-netflix": "#e30914",
          "green-watching": "#6dee76",
          "blue-completed": "#576bec",
          "yellow-on-hold": "#f2921c",
          "red-dropped": "#f51c1f",
          "grey-plan-to-watch": "#888888",
          "grey-flixlist": "#1b1b1b"
        }
      }
    },
    treeShake: true,
    options: {
      customProperties: true
    }
  },

  webfontloader: {
    google: {
      families: ["Roboto:400,700"] //Loads Roboto font with weights 400 and 700
    }
  },
  styleResources: {
    scss: ["~/assets/variables.scss"]
  },
  "google-adsense": {
    id: "ca-pub-4080768963424465"
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
};
