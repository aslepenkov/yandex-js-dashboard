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
  data: {
    completed: [],
    resultsTable: [],
  },
  methods: {
    getResults() {
      let players = ['4slepenkov', 'TEST']; //todo load
      let challengeSlugs = ['simple-fun-number-303-prime-product', 'printer-errors', 'tv-remote', 'tv-remote-wrap']; //todo load
      let data = [];

      for (let player of players) {
        let url = 'https://private-8fa4d2-xtstat.apiary-mock.com/'; //TODO 'https://www.codewars.com/api/v1/users/'+player+'/code-challenges/completed?access_key=TEST_KEY'
        axios
          .get(url)
          .then(response => {
            response.data.data.map(val => {
              val["player"] = player;
              val["time"] = val.completedAt;
              this.completed.push(val);
              data.push(val);
            });
          })
          .then(resp => {

          })
          .catch(error => {
            console.log(error);
          });


      };

      // this.resultsTable = players.map(player => {
      //   let row = {};
      //   row.playerName = player;

      //   for (let slug of challengeSlugs) {
      //     // let resulTime = this.completed.filter(res => {
      //     //   return (res.player === player && res.slug === challenge)
      //     // });
      //     //.map(s => s.time)[0];         


      //     row[slug] = [1].concat(data);
      //   }
      //   return row;
      // });


      return data;
    }
  },
  // beforeMount() {
  //   data = this.getResults();

    
  //   // var str = this.completed.toString();
  //   // console.log( this.completed.)
  //   this.resultsTable = players.map(player => {
  //     let row = {};
  //     row.playerName = player;

  //     for (let slug of challengeSlugs) {
  //       // let resulTime = this.completed.filter(res => {
  //       //   return (res.player === player && res.slug === challenge)
  //       // });
  //       //.map(s => s.time)[0];         


  //       row[slug] = '!' //data.map(m => m.player);
  //     }
  //     return row;
  //   });
  // },
  render: h => h(App)
})
