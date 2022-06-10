<template>
  <el-container>
    <!-- <el-header>xxx待定...</el-header> -->
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Batch Split</span>
          <el-button style="float: right; padding: 3px 0" type="text">待定</el-button>
        </div>
        <Send />
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Split Record</span>
          <el-button style="float: right; padding: 3px 0" type="text">待定</el-button>
        </div>
        <Query />
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import Query from '@/views/compute/account/queryPage'
import Send from '@/views/compute/account/send'
export default {
  name: 'Layout',
  components: {
    Query,
    Send
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
</style>
