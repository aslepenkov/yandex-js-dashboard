<template>
  <div id="app">
    <div v-if="loading">
      <div class="lds-hourglass"></div>Loading..
    </div>
    <b-table striped hover :items="items"></b-table>
    <div class="auth">Diff Time в часах. Время в формате H:MM</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      results: [],
      items: [],
      loading: true,
      players: [],
      challengeSlugs: []
    };
  },
  async beforeMount() {
    await this.fetchTableData(true);
  },
  async created() {
    await this.fetchTableData();

    this.items.sort(function(a, b) {
      var adoneCount = a.doneCount;
      var bdoneCount = b.doneCount;
      var aLow = a.diffTime;
      var bLow = b.diffTime;

      if (adoneCount === bdoneCount) {
        return aLow < bLow ? -1 : aLow > bLow ? 1 : 0;
      } else {
        return adoneCount < bdoneCount ? 1 : -1;
      }
    });
  },
  methods: {
    async getPlayersDataAsync() {
      try {
        let data = [];
        //load players
        let playersUrl =
          "https://yandex-js-dashboard-api.firebaseapp.com/players";
        //"https://private-8fa4d2-xtstat.apiary-mock.com/players";

        await axios
          .get(playersUrl)
          .then(response => {
            response.data.data.map(val => {
              data.push(val);
            });
          })
          .then(resp => {})
          .catch(error => {
            console.log(error);
          });

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async getSlugsDataAsync() {
      try {
        let data = [];
        //load challenges
        let slugsUrl = "https://yandex-js-dashboard-api.firebaseapp.com/slugs";
        await axios
          .get(slugsUrl)
          .then(response => {
            response.data.data.map(val => {
              data.push(val);
            });
          })
          .then(resp => {})
          .catch(error => {
            console.log(error);
          });

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async getResultsAsync(headersOnly) {
      try {
        let data = [];
        let secret = "WbsyyvpERFjV9csHcv_7";
        let run_count = headersOnly ? 1 : -500; //magic number!
        for (let player of this.players) {
          if (run_count++ > 1) continue;
          let url =
            "https://cors-anywhere.herokuapp.com/" + //TODO own server
            `www.codewars.com/api/v1/users/${player}/code-challenges/completed`;

          await axios
            .get(url)
            .then(response => {
              response.data.data.map(val => {
                val["player"] = player;
                val["time"] = val.completedAt;

                if (this.challengeSlugs.includes(val.slug)) {
                  data.push({
                    player: player,
                    slug: val.slug,
                    completedAt: val.completedAt,
                    done: "+"
                  });
                } else {
                  data.push({
                    player: player,
                    slug: val.slug,
                    completedAt: "",
                    done: "-"
                  });
                }
              });
            })
            .then(resp => {})
            .catch(error => {
              console.log(error);
            })
            .finally(() => {});
        }

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchTableData(first) {
      this.players = await this.getPlayersDataAsync();
      this.challengeSlugs = await this.getSlugsDataAsync();
      this.results = await this.getResultsAsync(first);

      this.items = await this.players.map(player => {
        let row = {};
        row.playerName = player;
        row.doneCount = 0;
        row.diffTime = 0;

        row._cellVariants = {};
        for (let slug of this.challengeSlugs) {
          let timestr = this.results
            .filter(res => {
              return res.player === player && res.slug === slug;
            })
            .map(s => s.completedAt)[0];

          if (!first) {
            let resultTime = new Date(timestr);

            let fastestTime = this.results
              .filter(res => {
                return res.slug === slug;
              })
              .map(s => new Date(s.completedAt))
              .filter(d => {
                return d instanceof Date && isFinite(d);
              })
              .sort((a, b) => {
                if (+a.getTime() > +b.getTime()) return 1;
                if (+a.getTime() < +b.getTime()) return -1;
                return 0;
              })[0];

            if (resultTime instanceof Date && isFinite(resultTime)) {
              row.doneCount++;
              row[slug] = "+";

              if (fastestTime.getTime() === resultTime.getTime()) {
                row._cellVariants[slug] = "success";
              } else {
                let diff = Math.abs(
                  resultTime.getTime() - fastestTime.getTime()
                );

                var seconds = diff / 1000;
                var hours = parseInt(seconds / 3600);
                seconds = seconds % 3600;
                var minutes = parseInt(seconds / 60);

                row.diffTime += Math.ceil(diff / 60000 / 60);
                row[slug] = `+${hours}:${minutes}`;
              }
            } else {
              row[slug] = "-";
              row._cellVariants[slug] = "danger";
            }
          }
        }

        return row;
      });

      if (!first) this.loading = false;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  
}

h1,
h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}

.auth {
  font-size: 10;
  color: silver;
}
.lds-hourglass {
  width: 30%;
  height: 30%;
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 6px;
  box-sizing: border-box;
  border: 26px solid rgb(97, 97, 97);
  border-color: rgb(97, 97, 97) transparent rgb(97, 97, 97) transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
</style>
