<template>
  <div id="app">
    <div v-if="loading">
      <div class="lds-hourglass"></div>Loading..
    </div>
    <b-table small responsive striped hover :sticky-header="stick" :items="items" :fields="fields">
      <template v-slot:cell(N)="data">
        <b-row class="mb-10">
          <b-col>{{data.index+1}}</b-col>
        </b-row>
      </template>

      <template v-slot:cell(playerName)="row">
        <b-row class="mb-10">
          <b-col>
            <div>
              <b>
                <span>
                  <div id="nickname">{{ row.item.playerName.nick }}</div>
                </span>
              </b>
            </div>
          </b-col>
        </b-row>
        <b-row class="mb-10">
          <b-col class="text-muted">{{ row.item.playerName.real }}</b-col>
        </b-row>
      </template>

      <template v-slot:cell(doneCount)="row">
        <b-row class="mb-10">
          <b-col>
            <div>
              <span>{{ row.item.doneCount.done}}/{{ row.item.doneCount.max }}</span>
            </div>
          </b-col>
        </b-row>
      </template>
    </b-table>
    <div class="auth">Diff Time в часах. Время в формате H:MM</div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config.js';

export default {
  name: 'CodeWarsTable',
  async beforeMount() {
    axios
      .get(config.itemsEndpoint)
      // .get('http://localhost:8000/api/items')
      .then((resp) => {
        this.loading = false;
        this.items = resp.data;
        this.fields.push(...Object.keys(this.items[0]).slice(4));
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(' /\\_/\\');
    console.log('( o.o )');
    console.log(' > ^ <');
  },
  data() {
    return {
      stick: '100%',
      results: [],
      items: [],
      loading: true,
      players: [],
      challengeSlugs: [],
      herokuappFail: false,
      fields: [
        {
          key: 'N',
          label: 'N',
          stickyColumn: true,
        },
        {
          key: 'playerName',
          label: 'Участник',
          stickyColumn: true,
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'doneCount',
          label: 'Решено задач',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'diffTime',
          label: 'Время',
        },
      ],
    };
  },
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
#nickname::first-letter {
  color: #e00;
}
</style>
