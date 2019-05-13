"use strict";

import CATEGORY from "./Category";

/**
 * Increment Meta
 */
export default class IncrementMeta {
  constructor(bucketImageObjects) {
    this.bucketImageObjects = bucketImageObjects || [];
    this.text = getInCrementMetaText(this.bucketImageObjects);
  }
}

/**
 * Get increment.meta text
 */
function getInCrementMetaText(bucketImageObjects) {
  const itemIdBaseNum = 1000;

  const incrementMetaJson = bucketImageObjects.map((e, i) => {
    const item_id = itemIdBaseNum + i;
    const cat_id = e.categoryId;
    const pic_list = [e.name];
    return new Row({ item_id, cat_id, pic_list });
  });

  const str = JSON.stringify(incrementMetaJson).replace(/},/g, "}\n");
  return str.substr(1, str.length - 2);
}

/**
 * Row of each IncrementMeta
 */
class Row {
  constructor(params) {
    this.operator = params.operator || "ADD";
    this.item_id = params.item_id || 99999999;
    this.cat_id = params.cat_id || CATEGORY.OTHERS.id;
    this.cust_content = params.cust_content || "k1:v1,k2:v2";
    this.pic_list = params.pic_list || [];
  }
}
