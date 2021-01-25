<template>
  <div id="app">
    <router-view/>

<!--    unity端avatar切换记录-->
    <editInfo/>
  </div>
</template>

<script>
  import editInfo from "./components/WebUnity/editInfo";
export default {
  name: 'App',
  components:{
    editInfo
  },
  mounted() {
  }
}
</script>

<style>

</style>
