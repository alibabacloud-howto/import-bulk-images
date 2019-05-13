'use strict';

/**
 * Bucket image object
 * 
 * It contains the data from bucket object.
 * It also contains additional properties that are input from user output to Increment meta file.
 */
exports.default = class BucketImageObject {
  constructor(params) {
    this.name = getName(params);
    this.url = params.url;
  }
}

/**
 * Get name
 */
function getName(params) {
  if (!params.name) return '';

  const delimiter = '/';
  return `${delimiter}${params.name}`.split(delimiter).pop();
}
