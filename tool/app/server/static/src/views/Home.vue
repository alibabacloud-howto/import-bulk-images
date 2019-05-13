<template>
  <div class="home">
    <!-- info message -->
    <div class="notification" v-show="infoMessage">
      <el-alert :title="infoMessage" type="info" show-icon> </el-alert>
    </div>

    <!-- user settings form -->
    <div style="padding:20px 2%;">
      <SettingsForm
        ref="settingsForm"
        @onSubmitSettingsForm="onSubmitSettingsForm"
        @onResetSettingsForm="onResetSettingsForm"
      ></SettingsForm>
    </div>

    <!-- bucket image object list -->
    <template v-if="bucketImageObjects.length > 0">
      <div style="margin-top:40px;">
        <BucketImageObjectList
          :bucketImageObjects="bucketImageObjects"
        ></BucketImageObjectList>
      </div>
    </template>

    <!-- output incremant.meta -->
    <template v-if="incrementMetaText && downloadUrl">
      <div style="margin:40px 0; padding:12px 1%;">
        <div style="padding:8px 0; font-size:24px;">increment.meta</div>
        <div style="padding:8px 0; font-size:16px;">Preview</div>
        <span
          id="incremant-meta-text"
          style="display:block; padding:8px 2%; background-color:lightgreen;
            line-height:32px; white-space:pre-wrap; word-wrap:break-word;"
          >{{ incrementMetaText }}</span
        >
        <div style="margin:16px 0;">
          <a
            :href="downloadUrl"
            download="increment.meta"
            style="font-size:20px;"
            >Download</a
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import IncrementMeta from "../model/IncrementMeta";
import BucketImageObject from "../model/BucketImageObject";
import BucketImageObjectList from "../components/BucketImageObjectList.vue";
import SettingsForm from "../components/SettingsForm.vue";

export default {
  components: { SettingsForm, BucketImageObjectList },
  props: {},
  data() {
    return {
      region: "",
      accessKeyId: "",
      accessKeySecret: "",
      bucket: "",

      hasSearchedBucket: false,
      hasConfiguredSetting: false,

      bucketImageObjects: []
    };
  },
  computed: {
    /**
     * Info Message
     */
    infoMessage() {
      if (!this.hasConfiguredSetting) {
        return "Please configure settings";
      }
      if (!this.hasSearchedBucket) {
        return "Please search bucket objects";
      }
      if (this.bucketImageObjects.length === 0) {
        return "No oss objects in the bucket";
      }
      return "";
    },

    /**
     * Increment Meta Text
     */
    incrementMetaText() {
      if (this.bucketImageObjects.length === 0) return "";

      const im = new IncrementMeta(this.bucketImageObjects);
      return im.text;
    },

    /**
     * Download Url
     */
    downloadUrl() {
      if (!this.incrementMetaText) return;

      const blob = new Blob([this.incrementMetaText], { type: "text/plain" });
      window.URL = window.URL || window.webkitURL;
      return window.URL.createObjectURL(blob);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * Fetch settings and set value into the settings form
     */
    init() {
      this.fetchSettings()
        .then(() => {
          this.$refs.settingsForm.update({
            region: this.region,
            accessKeyId: this.accessKeyId,
            accessKeySecret: this.accessKeySecret,
            bucket: this.bucket
          });
        })
        .catch(() => {});
    },

    /**
     * Settings form submit event handler
     */
    onSubmitSettingsForm(data) {
      // console.log(data);
      this.region = data.region;
      this.accessKeyId = data.accessKeyId;
      this.accessKeySecret = data.accessKeySecret;
      this.bucket = data.bucket;
      this.folder = data.folder;

      this.fetchBucketImageObjects();
    },

    /**
     * Settings form reset event handler
     */
    onResetSettingsForm(data) {
      // console.log(data);
      this.region = data.region;
      this.accessKeyId = data.accessKeyId;
      this.accessKeySecret = data.accessKeySecret;
      this.bucket = data.bucket;
      this.folder = data.folder;

      this.resetSettings();
    },

    /**
     * Fetch settings
     */
    fetchSettings() {
      const self = this;
      return new Promise((resolve, reject) => {
        const url = "/api/setting";
        fetch(url)
          .then(res => {
            return res.json();
          })
          .then(json => {
            // console.log(json);
            if (json.error) {
              reject();
              return;
            }

            self.region = json.region;
            self.accessKeyId = json.accessKeyId;
            self.accessKeySecret = json.accessKeySecret;
            self.bucket = json.bucket;
            self.hasConfiguredSetting = true;

            self.$notify({
              title: "Message",
              message: "Settings found!"
            });

            resolve();
          })
          .catch(() => {});
      });
    },

    /**
     * Reset settings
     */
    resetSettings() {
      const self = this;
      return new Promise((resolve, reject) => {
        const url = "/api/setting/reset";
        fetch(url)
          .then(res => {
            return res.json();
          })
          .then(json => {
            // console.log(json);
            if (json.error) {
              reject();
              return;
            }

            self.hasConfiguredSetting = false;

            self.$notify({
              title: "Message",
              message: "Reset complete!"
            });

            resolve();
          })
          .catch(() => {});
      });
    },

    /**
     * Fetch bucket image objects in the bucket
     */
    fetchBucketImageObjects() {
      const self = this;
      return new Promise((resolve, reject) => {
        if (
          !self.region ||
          !self.accessKeyId ||
          !self.accessKeySecret ||
          !self.bucket
        ) {
          reject();
          return;
        }

        const url = "/api/oss/bucket";
        const method = "POST";
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify({
          region: self.region,
          accessKeyId: self.accessKeyId,
          accessKeySecret: self.accessKeySecret,
          bucket: self.bucket
        });

        fetch(url, { method, headers, body })
          .then(res => {
            return res.json();
          })
          .then(json => {
            if (json.error) {
              reject();
              return;
            }

            self.bucketImageObjects = json.map(
              item => new BucketImageObject(item)
            );

            if (self.folder) {
              let folder = self.folder;
              if (folder !== "/" && folder[0] === "/")
                folder = folder.substr(1);
              if (folder !== "/" && folder[folder.length - 1] === "/")
                folder = folder.substr(0, folder.length - 1);
              if (folder !== "/") folder = `/${folder}/`;

              self.bucketImageObjects = self.bucketImageObjects.filter(item => {
                return item.url.includes(".com" + folder + item.name);
              });
            }
            self.hasConfiguredSetting = true;
            self.hasSearchedBucket = true;

            self.$notify({
              title: "Message",
              message: "Getting bucket objects succeeded!"
            });

            resolve();
          })
          .catch(() => {});
      });
    }
  }
};
</script>

<style scoped>
.notification >>> .el-alert {
  padding: 16px;
  margin: 16px 0;
}
.notification >>> .el-alert__title {
  font-size: 20px;
}
</style>
