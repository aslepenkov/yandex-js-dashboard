import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import LayoutPlugin from 'bootstrap-vue'
import TablePlugin from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(LayoutPlugin);
Vue.use(TablePlugin);

new Vue({
  el: '#app', 
  render: h => h(App)
})
