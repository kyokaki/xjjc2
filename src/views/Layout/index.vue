<template>
  <el-container>
    <el-main>
      <Auth />

      <Send />
      <Query />

    </el-main>
  </el-container>
</template>

<script>
import Query from '@/views/compute/account/query'
import Send from '@/views/compute/account/send'
import Auth from '@/views/compute/account/auth'
export default {
  name: 'Layout',
  components: {
    Query,
    Send,
    Auth
  },
  data() {
    return {

    }
  },
  methods: {

  }

}
</script>

<style>
.el-container {
  width: 80%;
  background: rgb(244, 244, 245);
  margin: 0 auto
}
.el-card {
  margin-bottom: 10px;
}
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    padding: 10px;
  }
</style>
