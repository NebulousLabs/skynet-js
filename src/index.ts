export { SkynetClient } from "./client";
export { deriveChildSeed, genKeyPairAndSeed, genKeyPairFromSeed } from "./crypto";
export { getRelativeFilePath, getRootDirectory } from "./utils/file";
export { MAX_REVISION } from "./utils/number";
export { parseSkylink } from "./utils/skylink";
export {
  defaultPortalUrl,
  defaultSkynetPortalUrl,
  uriHandshakePrefix,
  uriHandshakeResolverPrefix,
  uriSkynetPrefix,
} from "./utils/url";

// Export types.

export type { CustomClientOptions, RequestConfig } from "./client";
export type { Signature } from "./crypto";
export type { CustomDownloadOptions, ResolveHnsResponse } from "./download";
export type { CustomGetEntryOptions, CustomSetEntryOptions, SignedRegistryEntry, RegistryEntry } from "./registry";
export type { CustomGetJSONOptions, CustomSetJSONOptions, VersionedEntryData } from "./skydb";
export type { CustomUploadOptions, UploadRequestResponse } from "./upload";
export type { ParseSkylinkOptions } from "./utils/skylink";
