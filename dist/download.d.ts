import { SkynetClient } from "./client";
/**
 * Initiates a download of the content of the skylink within the browser.
 * @param {string} skylink - 46 character skylink.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 */
export declare function downloadFile(this: SkynetClient, skylink: string, customOptions?: any): void;
/**
 * Initiates a download of the content of the skylink at the Handshake domain.
 * @param {string} domain - Handshake domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hns"] - The relative URL path of the portal endpoint to contact.
 */
export declare function downloadFileHns(this: SkynetClient, domain: string, customOptions?: any): Promise<void>;
export declare function getSkylinkUrl(this: SkynetClient, skylink: string, customOptions?: any): string;
export declare function getHnsUrl(this: SkynetClient, domain: string, customOptions?: any): string;
export declare function getHnsresUrl(this: SkynetClient, domain: string, customOptions?: any): string;
export declare function getMetadata(this: SkynetClient, skylink: string, customOptions?: any): Promise<any>;
/**
 * Opens the content of the skylink within the browser.
 * @param {string} skylink - 46 character skylink.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 */
export declare function openFile(this: SkynetClient, skylink: string, customOptions?: {}): void;
/**
 * Opens the content of the skylink from the given Handshake domain within the browser.
 * @param {string} domain - Handshake domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hns"] - The relative URL path of the portal endpoint to contact.
 */
export declare function openFileHns(this: SkynetClient, domain: string, customOptions?: {}): Promise<void>;
/**
 * @param {string} domain - Handshake resolver domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hnsres"] - The relative URL path of the portal endpoint to contact.
 */
export declare function resolveHns(this: SkynetClient, domain: string, customOptions?: {}): Promise<any>;
//# sourceMappingURL=download.d.ts.map