
<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">About</el-menu-item>
      <el-menu-item index="2">Donation</el-menu-item>
    </el-menu>
    <!--  about -->
    <el-dialog
      title="About Computecoin Batch Transfer Tool"
      :visible.sync="aboutDialogVisible"
      width="30%"
      center
    >
      <div class="donation-address">
        <div>区块链应用研究室</div>
        <div>franklinmastermouse@gmail.com</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aboutDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 捐款 -->
    <el-dialog
      title="About Computecoin Batch Transfer Tool"
      :visible.sync="donationDialogVisible"
      width="30%"
      center
    >
      <div class="donation-address">
        <div>
          捐赠地址
        </div>
        <el-image src="./two.png" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="donationDialogVisible = false">确 定</el-button>
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
