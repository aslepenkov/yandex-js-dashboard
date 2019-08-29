<template>
  <div id="app">
    <div v-if="loading">
      <div class="lds-hourglass"></div>Loading..
    </div>
    <b-table striped hover :items="items">
      <template slot="[playerName]" slot-scope="row">
        <b-row class="mb-10">
          <b-col>
            <b>{{ row.item.playerName.nick }}</b>
          </b-col>
        </b-row>
        <b-row class="mb-10">
          <b-col class="text-muted">{{ row.item.playerName.real }}</b-col>
        </b-row>
      </template>
    </b-table>
    <div class="auth">Diff Time в часах. Время в формате H:MM</div>
  </div>
</template>

<script>
import axios from "axios";
import config from "./../config.js";

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
    this.items.forEach(i => (i.diffTime = this.kFormatter(i.diffTime)));
  },
  methods: {
    async getPlayersDataAsync() {
      try {
        let data = [];
        //load players
        let playersUrl = config.playersRealEndpoint;

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
        let slugsUrl = config.slugsEndpoint;
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
        for (let p of this.players) {
          let player = p.nick;
          if (run_count++ > 1) continue;
          let url = `${config.resultsEndpoint}${player}`;

          await axios
            .get(url)
            .then(response => {
              response.data.data.map(val => {
                if (this.challengeSlugs.map(s => s.name).includes(val.slug)) {
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
    kFormatter(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num);
    },
    async fetchTableData(first) {
      this.players = await this.getPlayersDataAsync();
      this.challengeSlugs = await this.getSlugsDataAsync();
      this.results = await this.getResultsAsync(first);

      this.items = await this.players.map(p => {
        let row = {};
        let player = p.nick;
        row.playerName = p;
        row.doneCount = 0;
        row.diffTime = 0;

        row._cellVariants = {};
        for (let slugObj of this.challengeSlugs) {
          let slug = slugObj.name;
          let expiryDate = slugObj.expiryDate;
          let startDate = slugObj.startDate;

          let timestr = this.results
            .filter(res => {
              return res.player === player && res.slug === slug;
            })
            .map(s => s.completedAt)
            .reverse()[0];

          if (!first) {
            let comletedTime = new Date(timestr);

            let resultTime = new Date(expiryDate) - comletedTime; //new Date(timestr);
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

            if (resultTime) {
              row.doneCount++;
              row[slug] = "+";

              let diff = Math.abs(
                comletedTime.getTime() - fastestTime.getTime()
              );
              let maxDiff = 12096e5; //two weeks

              if (diff > maxDiff) {
                diff = Math.abs(
                  comletedTime.getTime() - new Date(startDate).getTime()
                );
              }

              var seconds = diff / 1000;
              var hours = parseInt(seconds / 3600);
              seconds = seconds % 3600;
              var minutes = parseInt(seconds / 60);

              if (fastestTime.getTime() === comletedTime.getTime()) {
                row._cellVariants[slug] = "success";
              } else {
                row.diffTime += Math.ceil(diff / 60000 / 60);
                row[slug] = `+${hours}:${minutes}`;
              }

              if (resultTime < 0) {
                row._cellVariants[slug] = "warning";
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
  font-size: small;
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
