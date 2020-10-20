import axios, { AxiosResponse } from "axios";
import { uploadFile, uploadDirectory, uploadDirectoryRequest, uploadFileRequest } from "./upload";
import { addSkykey, createSkykey, getSkykeyById, getSkykeyByName, getSkykeys } from "./encryption";
import {
  downloadFile,
  downloadFileHns,
  getSkylinkUrl,
  getHnsUrl,
  getHnsresUrl,
  getMetadata,
  openFile,
  openFileHns,
  resolveHns,
} from "./download";

import { addUrlQuery, defaultPortalUrl, makeUrl } from "./utils";
import { getFile, setFile } from "./skydb";
import { lookupRegistry, updateRegistry } from "./registry";

export class SkynetClient {
  portalUrl: string;
  customOptions: Record<string, unknown>;

  /**
   * The Skynet Client which can be used to access Skynet.
   * @constructor
   * @param {string} [portalUrl="https://siasky.net"] - The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use "".
   * @param {Object} [customOptions={}] - Configuration for the client.
   * @param {string} [customOptions.method] - HTTP method to use.
   * @param {string} [customOptions.APIKey] - Authentication password to use.
   * @param {string} [customOptions.customUserAgent=""] - Custom user agent header to set.
   * @param {Object} [customOptions.data=null] - Data to send in a POST.
   * @param {string} [customOptions.endpointPath=""] - The relative URL path of the portal endpoint to contact.
   * @param {string} [customOptions.extraPath=""] - Extra path element to append to the URL.
   * @param {Function} [customOptions.onUploadProgress] - Optional callback to track progress.
   * @param {Object} [customOptions.query={}] - Query parameters to include in the URl.
   */
  constructor(portalUrl = defaultPortalUrl(), customOptions = {}) {
    this.portalUrl = portalUrl;
    this.customOptions = customOptions;
  }

  uploadFile = uploadFile;
  uploadDirectory = uploadDirectory;
  uploadDirectoryRequest = uploadDirectoryRequest;
  uploadFileRequest = uploadFileRequest;

  addSkykey = addSkykey;
  createSkykey = createSkykey;
  getSkykeyById = getSkykeyById;
  getSkykeyByName = getSkykeyByName;
  getSkykeys = getSkykeys;

  downloadFile = downloadFile;
  downloadFileHns = downloadFileHns;
  getSkylinkUrl = getSkylinkUrl;
  getHnsUrl = getHnsUrl;
  getHnsresUrl = getHnsresUrl;
  getMetadata = getMetadata;
  openFile = openFile;
  openFileHns = openFileHns;
  resolveHns = resolveHns;

  // SkyDB
  getFile = getFile;
  setFile = setFile;

  // SkyDB helpers
  lookupRegistry = lookupRegistry;
  updateRegistry = updateRegistry;

  /**
   * Creates and executes a request.
   * @param {Object} config - Configuration for the request. See docs for constructor for the full list of options.
   */
  executeRequest(config: any): Promise<AxiosResponse> {
    let url = config.url;
    if (!url) {
      url = makeUrl(this.portalUrl, config.endpointPath, config.extraPath ?? "");
      url = addUrlQuery(url, config.query);
    }

    // No other headers.
    const headers = config.customUserAgent && { "User-Agent": config.customUserAgent };

    return axios({
      url,
      method: config.method,
      data: config.data,
      headers,
      auth: config.APIKey && { username: "", password: config.APIKey },
      onUploadProgress:
        config.onUploadProgress &&
        function ({ loaded, total }) {
          const progress = loaded / total;

          config.onUploadProgress(progress, { loaded, total });
        },
    });
  }
}
