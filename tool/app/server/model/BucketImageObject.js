'use strict';

/**
 * Bucket image object class.
 *
 * It contains the data from OSS bucket.
 * It also contains additional properties input from user that will output to an Increment meta file.
 */
exports.default = class BucketImageObject {
  constructor(params) {
    this.name = getName(params);
    this.url = params.url;
  }
}

/**
 * Get the name.
 */
function getName(params) {
  if (!params.name) return '';

  const delimiter = '/';
  return `${delimiter}${params.name}`.split(delimiter).pop();
}
