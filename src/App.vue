<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import { requestServices } from "./api/api";

  export default {
  name: 'App',
  mounted() {

      // requestServices.getAllAvatars({
      //   user_id:this.$Session.get('ai_user_id'),
      //   role_id: 23,
      //   access_token:this.$Session.get('ai_user_token'),
      //   isAll: 1
      // }).then(res=> {
      //   if (res.return_code == 1000) {
      //     console.log(res)
      //   }
      // })
  }
}
</script>

<style>

</style>
