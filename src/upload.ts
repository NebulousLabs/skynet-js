import { defaultOptions, uriSkynetPrefix, getFileMimeType } from "./utils";

const defaultUploadOptions = {
  ...defaultOptions("/skynet/skyfile"),
  portalFileFieldname: "file",
  portalDirectoryFileFieldname: "files[]",
  customFilename: "",
};

export async function uploadFile(file: File, customOptions = {}): Promise<string> {
  const response = await this.uploadFileRequest(file, customOptions);

  return `${uriSkynetPrefix}${response.skylink}`;
}

export async function uploadFileRequest(file: File, customOptions = {}): Promise<any> {
  const opts = { ...defaultUploadOptions, ...this.customOptions, ...customOptions };

  const formData = new FormData();
  file = ensureFileObjectConsistency(file);
  if (opts.customFilename) {
    formData.append(opts.portalFileFieldname, file, opts.customFilename);
  } else {
    formData.append(opts.portalFileFieldname, file);
  }

  const { data } = await this.executeRequest({
    ...opts,
    method: "post",
    data: formData,
  });

  return data;
}

/**
 * Uploads a local directory to Skynet.
 * @param {Object} directory - File objects to upload, indexed by their path strings.
 * @param {string} filename - The name of the directory.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [config.APIKey] - Authentication password to use.
 * @param {string} [config.customUserAgent=""] - Custom user agent header to set.
 * @param {string} [customOptions.endpointPath="/skynet/skyfile"] - The relative URL path of the portal endpoint to contact.
 * @param {Function} [config.onUploadProgress] - Optional callback to track progress.
 * @param {string} [customOptions.portalDirectoryfilefieldname="files[]"] - The fieldName for directory files on the portal.
 * @returns {Object} data - The returned data.
 * @returns {string} data.skylink - The returned skylink.
 * @returns {string} data.merkleroot - The hash that is encoded into the skylink.
 * @returns {number} data.bitfield - The bitfield that gets encoded into the skylink.
 */
export async function uploadDirectory(directory: any, filename: string, customOptions = {}): Promise<string> {
  const response = await this.uploadDirectoryRequest(directory, filename, customOptions);

  return `${uriSkynetPrefix}${response.skylink}`;
}

export async function uploadDirectoryRequest(directory: any, filename: string, customOptions = {}): Promise<any> {
  const opts = { ...defaultUploadOptions, ...this.customOptions, ...customOptions };

  const formData = new FormData();
  Object.entries(directory).forEach(([path, file]) => {
    file = ensureFileObjectConsistency(file as File);
    formData.append(opts.portalDirectoryFileFieldname, file as File, path);
  });

  const { data } = await this.executeRequest({
    ...opts,
    method: "post",
    data: formData,
    query: { filename },
  });

  return data;
}

/**
 * Sometimes file object might have had the type property defined manually with
 * Object.defineProperty and some browsers (namely firefox) can have problems
 * reading it after the file has been appended to form data. To overcome this,
 * we recreate the file object using native File constructor with a type defined
 * as a constructor argument.
 * Related issue: https://github.com/NebulousLabs/skynet-webportal/issues/290
 */
function ensureFileObjectConsistency(file: File): File {
  return new File([file], file.name, { type: getFileMimeType(file) });
}
