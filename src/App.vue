<template>
  <div id="app">
    <!-- <ul id="example-1" v-for="results in data.completed">
      {{results[0].player}}
      <li v-for="result in results">{{ result.name }}</li>
    </ul>-->

    <b-table striped hover :items="items"></b-table>

    <pre>completed: {{data.completed}}</pre>
    <pre>resultsTable: {{data.resultsTable}}</pre>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      data: this.$root.$data,
      items: this.$root.$data.resultsTable
    };
  }
};
</script>S

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
