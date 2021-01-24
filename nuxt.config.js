export default {
  target: "server",
  // ssr: false,
  dev: true,
  debug: true,
  serverMiddleware: [
    function(req, res, next) {
      // req is the Node.js http request object

      // res is the Node.js http response object
      console.log("req");
      // next is a function to call to invoke the next middleware
      // Don't forget to call next at the end if your middleware is not an endpoint!
      next();
    }
  ],
  plugins: [
    /* "~/plugins/firebase",
    "~/plugins/auth",
    "~/plugins/vue-scrollactive",
    "~/plugins/ad.client" */
  ],
  components: true,
  buildModules: [],
  modules: [
    ,
    /*      "@nuxtjs/moment",
     */ /* "@nuxtjs/vuetify" */ /* "nuxt-webfontloader", */
    /* "@nuxtjs/style-resources",
    "@nuxt/typescript-build" */
    //"@nuxtjs/imagemin",
    //"@nuxtjs/pwa"

    /*  "@nuxtjs/firebase",
    "nuxt-vuex-localstorage",
    "@nuxtjs/google-adsense",
    ["@nuxtjs/toast", { duration: 5000, position: "bottom-center" }],
    "@nuxtjs/robots",
    "cookie-universal-nuxt",
    "vue-social-sharing/nuxt" */
  ]
};
