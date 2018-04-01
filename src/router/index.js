import Vue from "vue";
import Router from "vue-router";


const _import = require("./_import_" + process.env.NODE_ENV);
console.log(_import);

Vue.use(Router);

const Layout = _import("layout/index");

const Home = _import("components/home");
const hello = _import("components/hello");

const notfound = _import("components/40x/404");
import Home2 from "../components/home.vue";
console.log(Home, Home2);
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout
    },
    {
      path: "/home",
      name: "Home",
      component: Home
    },
    {
      path: "/hello",
      name: "hello",
      component: hello
    },
    { path: "*", name: "404", component: notfound }
  ]
});
