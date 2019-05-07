"use strict";

export default class IncrementMeta {
  constructor(bucketObjects) {
    this.bucketObjects = bucketObjects || [];
    this.text = getInCrementMetaText(this.bucketObjects);
  }
}

/** private */

/**
 * Get increment.meta text
 */
function getInCrementMetaText(objs) {
  const itemIdBaseNum = 1000;

  const incrementMetaJson = objs.map((e, i) => {
    const operator = "ADD";
    const item_id = itemIdBaseNum + i;
    const cat_id = e.category;
    const cust_content = "k1:v1,k2:v2";
    const pic_list = [e.name];
    return { operator, item_id, cat_id, cust_content, pic_list };
  });

  const str = JSON.stringify(incrementMetaJson).replace(/},/g, "}\n");
  return str.substr(1, str.length - 2);
}
