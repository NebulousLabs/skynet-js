/* eslint-disable no-unused-vars */

import { SkynetClient } from "./client.js";
import { makeUrlWithSkylink, defaultOptions } from "./utils.js";

const defaultDownloadOptions = {
  ...defaultOptions("/"),
};

SkynetClient.prototype.download = function (skylink, customOptions = {}) {
  const opts = { ...defaultDownloadOptions, ...customOptions, download: true };
  const url = this.getDownloadUrl(skylink, opts);

  const downloadElement = document.createElement("a");
  downloadElement.setAttribute("href", url);
  downloadElement.setAttribute("download", true);
  downloadElement.click();
};

SkynetClient.prototype.getDownloadUrl = function (skylink, customOptions = {}) {
  const opts = { ...defaultDownloadOptions, ...customOptions };
  const query = opts.download ? { attachment: true } : {};

  return makeUrlWithSkylink(this.portalUrl, opts.endpointPath, skylink, query);
};

SkynetClient.prototype.metadata = function (skylink, customOptions = {}) {
  const opts = { ...defaultDownloadOptions, ...customOptions };

  throw new Error("Unimplemented");
};

SkynetClient.prototype.open = function (skylink, customOptions = {}) {
  const opts = { ...defaultDownloadOptions, ...customOptions };
  const url = makeUrlWithSkylink(this.portalUrl, opts.endpointPath, skylink);

  window.open(url, "_blank");
};
