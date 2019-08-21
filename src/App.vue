<template>
  <div id="app">
    <div v-if="loading">Loading...</div>

    <b-table striped hover :items="items"></b-table>

    <pre>players: {{players}}</pre>
    <pre>challengeSlugs: {{challengeSlugs}}</pre>
    <pre>posts: {{posts}}</pre>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      posts: [],
      items: [],
      loading: true,
      players: [],
      challengeSlugs: []
    };
  },
  async created() {
    await this.fetchTableData();
  },
  methods: {
    async getPlayersDataAsync() {
      try {
        let data = [];
        //load players
        let playersUrl =
          "https://private-8fa4d2-xtstat.apiary-mock.com/players";

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
        let slugsUrl = "https://private-8fa4d2-xtstat.apiary-mock.com/slugs";
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
    async getPostsAsync() {
      try {
        let data = [];

        for (let player of this.players) {
          let url = "https://private-8fa4d2-xtstat.apiary-mock.com/"; //TODO 'https://www.codewars.com/api/v1/users/'+player+'/code-challenges/completed?access_key=TEST_KEY'
          await axios
            .get(url)
            .then(response => {
              response.data.data.map(val => {
                val["player"] = player;
                val["time"] = val.completedAt;

                data.push(val);
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
    async fetchTableData() {
      this.players = await this.getPlayersDataAsync();
      this.challengeSlugs = await this.getSlugsDataAsync();
      this.posts = await this.getPostsAsync();

      this.items = this.players.map(player => {
        let row = {};
        row.playerName = player;

        for (let slug of this.challengeSlugs) {
          let timestr = this.posts
            .filter(res => {
              return res.player === player && res.slug === slug;
            })
            .map(s => s.completedAt)[0];

          // let timestr = new Date(
          //   resulTime.getTime() - resulTime.getTimezoneOffset() * 60000
          // )F
          //   .toISOString()F
          //   .replace("T", " ")
          //   .slice(0, 16);

          let resultTime = new Date(timestr);

          if (resultTime instanceof Date && isFinite(resultTime)) {
            row[slug] = resultTime;
          } else {
            row[slug] = "-";
          }
        }
        return row;
      });
      this.loading = false;
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
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

/* ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
} */

a {
  color: #42b983;
}
</style>
