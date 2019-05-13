"use strict";

import CATEGORY from "./Category";

/**
 * Bucket image object
 *
 * It contains the data from bucket object.
 * It also contains additional properties that are input from user output to Increment meta file.
 */
export default class BucketImageObject {
  constructor(params) {
    this.name = getName(params);
    this.url = params.url;

    this.categoryId = params.categoryId || CATEGORY.OTHERS.id;
  }
}

/**
 * Get name
 */
function getName(params) {
  if (!params.name) return "";

  const delimiter = "/";
  return `${delimiter}${params.name}`.split(delimiter).pop();
}
