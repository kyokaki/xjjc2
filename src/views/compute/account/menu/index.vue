<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" style="float:right">About</el-menu-item>
    </el-menu>
    <!--  about -->
    <el-dialog
      title="About"
      :visible.sync="aboutDialogVisible"
      width="30%"
      center
    >
      <div class="donation-address">
        <h3>CCN区块链技术应用研究实验室</h3>
        <h3>franklinmastermouse@gmail.com</h3>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aboutDialogVisible = false">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      aboutDialogVisible: false,
      donationDialogVisible: false
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (key === '1') {
        this.openAboutDialog()
      } else if (key === '2') {
        this.openDonationDialog()
      }
    },
    openDonationDialog() {
      this.donationDialogVisible = true
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
