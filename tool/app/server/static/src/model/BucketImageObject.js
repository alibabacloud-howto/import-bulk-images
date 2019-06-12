"use strict";

import CATEGORY from "./Category";

/**
 * Bucket image object class.
 *
 * It contains the data from OSS bucket.
 * It also contains additional properties input from user that will output to an Increment meta file.
 */
export default class BucketImageObject {
  constructor(params, index) {
    this.name = getName(params);
    this.url = params.url;

    this.itemId = params.itemId || 1000 + index + "";
    this.categoryId = params.categoryId || CATEGORY.OTHERS.id;
    this.custContent = params.custContent || `this is product ${this.itemId}`;
  }
}

/**
 * Get the name.
 */
function getName(params) {
  if (!params.name) return "name";

  const delimiter = "/";
  return `${delimiter}${params.name}`.split(delimiter).pop();
}
