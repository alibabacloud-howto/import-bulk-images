<template>
  <div>
    <div style="margin-bottom:32px; font-size:28px;">User Settings</div>

    <el-form
      :model="settingsForm"
      :rules="rules"
      ref="settingsForm"
      label-width="140px"
      class="setting-form"
    >
      <el-form-item
        label="accessKeyId"
        prop="accessKeyId"
        style="max-width:600px;"
      >
        <el-input
          v-model="settingsForm.accessKeyId"
          placeholder="XXXXXXXXXXXXXXXX"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="accessKeySecret"
        prop="accessKeySecret"
        style="max-width:600px;"
      >
        <el-input
          v-model="settingsForm.accessKeySecret"
          placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ></el-input>
      </el-form-item>

      <el-form-item label="OSS region" prop="region" style="max-width:600px;">
        <el-input
          v-model="settingsForm.region"
          placeholder="oss-cn-shanghai"
        ></el-input>
      </el-form-item>

      <el-form-item label="OSS bucket" prop="bucket" style="max-width:600px;">
        <el-input
          v-model="settingsForm.bucket"
          placeholder="my-bucket"
        ></el-input>
        <div v-if="bucketLink" style="padding:0 2%;">
          <el-button type="text">
            <a :href="bucketLink" target="_blank">bucket link</a>
          </el-button>
        </div>
      </el-form-item>

      <el-form-item
        class="bucket-folder-input"
        label="OSS bucket folder (opitonal)"
        prop="folder"
        style="max-width:600px;"
      >
        <el-input
          v-model="settingsForm.folder"
          placeholder="img/bags"
        ></el-input>
      </el-form-item>

      <el-form-item style="margin-top:40px;">
        <el-button @click="resetForm('settingsForm')">Reset</el-button>
        <span style="margin-left:12px;"></span>
        <el-button type="primary" @click="submitForm('settingsForm')"
          >Get Image Files</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingsForm: {
        region: "",
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
        folder: ""
      },
      rules: {
        region: [
          { required: true, message: "Please input region", trigger: "blur" }
        ],
        accessKeyId: [
          {
            required: true,
            message: "Please input accessKeyId",
            trigger: "blur"
          }
        ],
        accessKeySecret: [
          {
            required: true,
            message: "Please input accessKeySecret",
            trigger: "blur"
          }
        ],
        bucket: [
          { required: true, message: "Please input bucket", trigger: "blur" }
        ],
        folder: [
          {
            required: false,
            message: "Please input bucket folder",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    /**
     * OSS bucket link
     */
    bucketLink() {
      if (!this.settingsForm.region || !this.settingsForm.bucket) return "";
      return `https://oss.console.aliyun.com/bucket/${
        this.settingsForm.region
      }/${this.settingsForm.bucket}/object`;
    }
  },
  mounted() {},
  methods: {
    /**
     * Update form data. called from Home.vue. using vuex is better
     */
    update(data) {
      this.settingsForm.region = data.region;
      this.settingsForm.accessKeyId = data.accessKeyId;
      this.settingsForm.accessKeySecret = data.accessKeySecret;
      this.settingsForm.bucket = data.bucket;
    },

    /**
     * Submit form
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("onSubmitSettingsForm", this.settingsForm);
        } else {
          return false;
        }
      });
    },

    /** Reset form */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("onResetSettingsForm", this.settingsForm);
    }
  }
};
</script>

<style scoped>
.setting-form >>> .el-form-item__label {
  font-size: 16px;
}
.bucket-folder-input >>> .el-form-item__label {
  line-height: normal;
}
</style>
