<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="padding:8px 0; font-size:24px;">Bucket object list</div>
        <div style="padding:8px 0; font-size:16px;">
          check objects and set categories
        </div>
      </div>
      <div v-for="item in bucketImageObjects" :key="item.url">
        <div style="display:flex; padding:8px 0; min-height:20px;">
          <div style="margin-right:12px;">{{ item.name }}</div>
          <div style="margin-right:12px;">
            <img style="max-height:80px;" :src="item.url" :alt="item.url" />
          </div>
          <select v-model="item.category">
            <option
              v-for="c in Object.values(CATEGORY)"
              :key="c.id"
              :value="c.id"
              >{{ c.description }}</option
            >
          </select>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import CATEGORY from "../model/Category";

export default {
  components: {},
  props: {
    bucketImageObjects: {
      default: []
    }
  },
  data() {
    return {
      CATEGORY
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style scoped></style>
