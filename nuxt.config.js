module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "insurance",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  build: {
    vendor: ["mint-ui", "axios"],
    babel: {
      plugins: [
        // [
        //   "component",
        //   [
        //     {
        //       libraryName: "mint-ui",
        //       style: true
        //     },
        //     "transform-async-to-generator",
        //     "transform-runtime"
        //   ]
        // ]
      ],
      comments: true
    }
  },
  plugins: [{ src: "~plugins/mint-ui", ssr: true }]
};
