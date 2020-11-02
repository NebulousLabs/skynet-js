import { SkynetClient, CustomClientOptions } from "./client";
declare type CustomUploadOptions = {
    portalFileFieldname?: string;
    portalDirectoryFileFieldname?: string;
    customFilename?: string;
} & CustomClientOptions;
export declare function uploadFile(this: SkynetClient, file: File, customOptions?: CustomUploadOptions): Promise<string>;
export declare function uploadFileRequest(this: SkynetClient, file: File, customOptions?: CustomUploadOptions): Promise<any>;
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
export declare function uploadDirectory(this: SkynetClient, directory: any, filename: string, customOptions?: CustomUploadOptions): Promise<string>;
export declare function uploadDirectoryRequest(this: SkynetClient, directory: any, filename: string, customOptions?: CustomUploadOptions): Promise<any>;
export {};
//# sourceMappingURL=upload.d.ts.map