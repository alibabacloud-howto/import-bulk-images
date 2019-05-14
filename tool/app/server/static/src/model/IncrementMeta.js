"use strict";

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
  const incrementMetaJson = bucketImageObjects.map(bucketImageObject => {
    return new Row(bucketImageObject);
  });

  const str = JSON.stringify(incrementMetaJson).replace(/},/g, "}\n");
  return str.substr(1, str.length - 2);
}

/**
 * Row of each IncrementMeta
 */
class Row {
  constructor(bucketImageObject) {
    this.operator = "ADD";
    this.item_id = bucketImageObject.itemId;
    this.cat_id = bucketImageObject.categoryId;
    this.cust_content = bucketImageObject.custContent;
    this.pic_list = [bucketImageObject.name];
  }
}
