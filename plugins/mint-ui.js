import Vue from "vue";
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);
// 全部引用，此时需要在nuxt.config.js中设置css
// if (process.BROWSER_BUILD) {
//   Vue.use(Mint);
// }

// 按需引用
// import { Button } from 'element-ui'
// Vue.component(Button.name, Button)
