export default {
  target: "server",
  build: {
    extend(config, { isServer }) {
      if (isServer) {
        config.externals = {
          "@firebase/app": "commonjs @firebase/app",
          "@firebase/auth": "commonjs @firebase/auth",
          "@firebase/firestore": "commonjs @firebase/firestore"
        };
      }
    }
  },
  plugins: [
    "~/plugins/firebase",
    "~/plugins/auth",
    "~/plugins/vue-scrollactive",
    "~/plugins/ad.client"
  ],
  components: true,
  buildModules: [],
  modules: [
    "@nuxtjs/moment",
    "@nuxtjs/vuetify",
    "nuxt-webfontloader",
    "@nuxtjs/style-resources",
    "@nuxt/typescript-build",
    "@nuxtjs/imagemin",
    "@nuxtjs/pwa",

    "@nuxtjs/firebase",
    "nuxt-vuex-localstorage",
    "@nuxtjs/google-adsense",
    ["@nuxtjs/toast", { duration: 5000, position: "bottom-center" }],
    "@nuxtjs/robots",
    "cookie-universal-nuxt",
    "vue-social-sharing/nuxt"
  ],
  firebase: {
    /* config: {
      apiKey: "AIzaSyCUYPpn9MwXRg5bTohGcJEfeC5A9WMSEGc",
      authDomain: "myflix-prod.firebaseapp.com",
      databaseURL: "https://myflix-prod.firebaseio.com/",
      projectId: "myflix-prod",
      storageBucket: "myflix-prod.appspot.com",
      messagingSenderId: "512304943565",
      appId: "1:512304943565:web:2e0507e8a0dc807fc8f484",
      measurementId: "G-S0Y1CVJVWP"
    }, */
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
      auth: {
        initialize: {
          onAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION"
        }
      }
    }
  },
  css: ["@/assets/main.scss", "@/node_modules/swiper/swiper-bundle.css"],
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#e30914",
          blackHeader: "#191919",
          "black-search": "#0f0f0f",
          "black-subheader": "#252525",
          blackBody: "#141414",
          greyButton: "#363636",
          grey: "#828282",
          "red-netflix": "#e30914",
          "green-watching": "#6dee76",
          "blue-completed": "#576bec",
          "yellow-on-hold": "#f2921c",
          "red-dropped": "#f51c1f",
          "grey-save-for-later": "#888888",
          "grey-flixlist": "#1b1b1b"
        }
      }
    },
    treeShake: true
  },
  webfontloader: {
    google: {
      families: ["Roboto:400,700"]
    }
  },
  styleResources: {
    scss: ["~/assets/variables.scss"]
  },
  head: {
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  pwa: {
    meta: {
      name: "Myflix",
      author: "Inc•lusive",
      ogSiteName: "Myflix",
      ogTitle: "Myflix",
      ogDescription:
        "Find User recommendations/suggestions, reviews, ratings, look at your personal statistics, and more! 😍 The project is currently in a development phase, but we are looking forward to hearing from you. (75%)",
      ogHost: "https://my-flix.net",
      ogImage: "/myflixFavicon2.png"
    },
    manifest: {
      name: "Myflix",
      short_name: "Myflix",
      description:
        "Find User recommendations/suggestions, reviews, ratings, look at your personal statistics, and more! 😍 The project is currently in a development phase, but we are looking forward to hearing from you. (75%)",
      start_url:
        process.env.NODE_ENV === "dev"
          ? "http://localhost:3000"
          : "https:/my-flix.net"
    }
  },
  "google-adsense": {
    id: "ca-pub-4080768963424465"
  }
};
