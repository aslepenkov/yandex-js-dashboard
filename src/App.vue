<template>
  <div id="app">
    <CodeWarsTable />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import CodeWarsTable from "./components/CodeWarsTable.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
    CodeWarsTable
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
