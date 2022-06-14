<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">About</el-menu-item>
    </el-menu>
    <el-dialog
      title="About Computecoin Batch Transfer Tool"
      :visible.sync="aboutDialogVisible"
      width="30%"
      center
    >
      <div>
        <span>区块链应用研究室：</span>
        <span>franklinmastermouse@gmail.com</span>
      </div>
      <div class="donation-address">
        <div>
          捐赠地址
        </div>
        <el-image src="./two.png" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aboutDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      aboutDialogVisible: false
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (key === '1') {
        this.openAboutDialog()
      }
    },
    openAboutDialog() {
      this.aboutDialogVisible = true
    }
  }
}
</script>

<style scoped>
.donation-address {
  text-align: center;
  margin-top: 20px;
}
</style>
