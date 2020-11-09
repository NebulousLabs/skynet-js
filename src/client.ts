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
import { getJSON, setJSON } from "./skydb";
import { getEntry, getEntryUrl, setEntry } from "./registry";

import { addUrlQuery, defaultPortalUrl, makeUrl } from "./utils";

export type CustomClientOptions = {
  /** authentication password to use */
  APIKey?: string;
  /** custom user agent header to set */
  customUserAgent?: string;
  /** optional callback to track upload progress */
  onUploadProgress?: (progress: number, event: ProgressEvent) => void;
};

export class SkynetClient {
  portalUrl: string;
  customOptions: CustomClientOptions;

  /**
   * The Skynet Client which can be used to access Skynet.
   * @param [portalUrl] The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use ""
   * @param [customOptions] Configuration for the client
   */
  constructor(portalUrl: string = defaultPortalUrl(), customOptions: CustomClientOptions = {}) {
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
  db = {
    getJSON: getJSON.bind(this),
    setJSON: setJSON.bind(this),
  };

  // SkyDB helpers
  registry = {
    getEntry: getEntry.bind(this),
    getEntryUrl: getEntryUrl.bind(this),
    setEntry: setEntry.bind(this),
  };

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
        function (event: ProgressEvent) {
          const progress = event.loaded / event.total;

          config.onUploadProgress(progress, event);
        },
      timeout: config.timeout,
    });
  }
}
