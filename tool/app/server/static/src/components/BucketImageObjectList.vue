<template>
  <div>
    <div style="margin-bottom:32px;">
      <div style="padding:8px 0; font-size:28px;">Bucket image object list</div>
      <div style="padding:8px 0; font-size:20px; color:#333;">
        Pleae check objects and set
        <a
          href="https://www.alibabacloud.com/help/doc-detail/66580.htm"
          target="_blank"
          >properties.</a
        >
      </div>
    </div>

    <el-card
      class="box-card"
      v-for="item in bucketImageObjects"
      :key="item.url"
    >
      <div style="display:flex; padding:12px 0;">
        <!-- name -->
        <div style="margin-left:12px;">{{ item.name }}</div>
        <!-- image -->
        <div style="margin-left:12px;">
          <img style="max-height:80px;" :src="item.url" :alt="item.url" />
        </div>
      </div>

      <div style="display:flex; align-item:center; padding:12px 0;">
        <!-- itemId -->
        <div style="margin-left:12px;">
          ID:
          <el-input
            placeholder="Please input id"
            v-model="item.itemId"
          ></el-input>
        </div>
        <!-- category -->
        <div style="margin-left:12px;">
          Category:
          <select
            v-model="item.categoryId"
            style="display:block; height:40px; border: 1px solid #dedfe6;"
          >
            <option
              v-for="c in Object.values(CATEGORY)"
              :key="c.id"
              :value="c.id"
              >{{ c.description }}</option
            >
          </select>
        </div>
        <!-- custContent -->
        <div style="margin-left:12px;">
          Custom content:
          <el-input
            placeholder="Please input custom content"
            v-model="item.custContent"
          ></el-input>
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
