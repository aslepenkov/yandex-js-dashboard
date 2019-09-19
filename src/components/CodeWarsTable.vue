<template>
  <div id="app">
    <div v-if="loading">
      <div class="lds-hourglass"></div>Loading..
    </div>

    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filter"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Ник или Имя участника"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <b-table
      small
      responsive
      striped
      hover
      :sticky-header="stick"
      :items="items"
      :fields="fields"
      :filter="filter"
      :filterIncludedFields="filterOn"
      @filtered="onFiltered"
    >
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
import axios from "axios";
import config from "../config.js";

export default {
  name: "CodeWarsTable",
  computed: {},
  mounted() {},
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
    }
  },
  async beforeMount() {
    axios
      .get(config.itemsEndpoint)
      // .get('http://localhost:8000/api/items')
      .then(resp => {
        this.loading = false;
        this.items = resp.data;
        this.fields.push(...Object.keys(this.items[0]).slice(4));
      })
      .catch(error => {
        console.log(error);
      });

    console.log(" /\\_/\\");
    console.log("( o.o )");
    console.log(" > ^ <");
  },
  data() {
    return {
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      //NEW
      stick: "100%",
      results: [],
      items: [],
      loading: true,
      players: [],
      challengeSlugs: [],
      herokuappFail: false,
      fields: [
        {
          key: "N",
          label: "N",
          stickyColumn: true,
          sortable: false
        },
        {
          key: "playerName",
          label: "Участник",
          stickyColumn: true,
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "doneCount",
          label: "Решено задач",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "diffTime",
          label: "Время"
        }
      ]
    };
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
#nickname::first-letter {
  color: #e00;
}
</style>
