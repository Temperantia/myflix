export default {
  target: "server",
  components: true,
  modules: [
    "@nuxtjs/moment",
    "@nuxtjs/vuetify",
    "nuxt-webfontloader",
    "@nuxtjs/style-resources",
    "@nuxt/typescript-build",
    "@nuxtjs/imagemin",
    "@nuxtjs/pwa",

    "nuxt-vuex-localstorage",
    "@nuxtjs/google-adsense",
    ["@nuxtjs/toast", { duration: 5000, position: "bottom-center" }],
    "cookie-universal-nuxt",
    "vue-social-sharing/nuxt"
  ],
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
      name: "MYFLIX",
      author: "Inc • Digital",
      ogSiteName: "my-flix.net",
      ogTitle: "MYFLIX",
      ogDescription:
        "Find User recommendations/suggestions, reviews, ratings, look at your personal statistics, and more! 😍 The project is currently in a development phase, but we are looking forward to hearing from you. (75%)",
      ogHost: "https://my-flix.net",
      ogImage: "/myflixFavicon2.png"
    },
    manifest: {
      name: "MYFLIX",
      short_name: "MYFLIX",
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
