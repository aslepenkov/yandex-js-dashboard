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


      for (let player of players) {
        let url = 'http://private-8fa4d2-xtstat.apiary-mock.com/'; // 'https://www.codewars.com/api/v1/users/'+player+'/code-challenges/completed?access_key=TEST_KEY'
        axios
          .get(url)
          .then(response => {
            response.data.data.map(val => {
              val["player"] = player;
              val["time"] = val.completedAt;
              this.completed.push(val);
              // let date = new Date(val.completedAt);
              // this.completed.push({
              //   player: player,
              //   name: val.slug,
              //   time: String(date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU")),
              // });
            });
          })
          .catch(error => {
            console.log(error);
          });
      };


      //cc.completed.map(userresults => userresults.filter(res => res.name === challenge && res.player === player)[0].time || '')
      this.resultsTable = players.map(player => {
        let row = {};
        row.playerName = player;

        for (let slug of challengeSlugs) {
          let resulTime = this.completed.filter(m => m.player === player);
          row[slug] = resulTime;
        }
        //        challengeSlugs.forEach(challenge => row[challenge] = this.completed) //(res => res.slug === challenge && res.player === player).map(s => s.time)[0])
        return row;
      });



    }
  },
  beforeMount() {
    this.getResults();
  },
  render: h => h(App)
})
