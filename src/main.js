import Vue from 'vue';
import {
  BootstrapVue,
  LayoutPlugin,
  TablePlugin,
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import './registerServiceWorker';


Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(LayoutPlugin);
Vue.use(TablePlugin);

new Vue({
  render: h => h(App),
}).$mount('#app');
