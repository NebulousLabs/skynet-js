export declare const defaultSkynetPortalUrl = "https://siasky.net";
export declare const uriHandshakePrefix = "hns:";
export declare const uriHandshakeResolverPrefix = "hnsres:";
export declare const uriSkynetPrefix = "sia:";
export declare function addUrlQuery(url: string, query: Record<string, unknown>): string;
export declare function defaultOptions(endpointPath: string): {
    endpointPath: string;
    APIKey: string;
    customUserAgent: string;
};
export declare function defaultPortalUrl(): string;
export declare function getRelativeFilePath(file: File): string;
export declare function getRootDirectory(file: File): string;
/**
 * Properly joins paths together to create a URL. Takes a variable number of
 * arguments.
 */
export declare function makeUrl(...args: string[]): string;
export declare function parseSkylink(skylink: string): string;
export declare function trimUriPrefix(str: string, prefix: string): string;
export declare function randomNumber(low: number, high: number): number;
export declare function stringToUint8Array(str: string): Uint8Array;
export declare function hexToUint8Array(str: string): Uint8Array;
export declare function readData(file: File): Promise<string | ArrayBuffer>;
/**
 * Get the file mime type. In case the type is not provided, use mime-db and try
 * to guess the file type based on the extension.
 */
export declare function getFileMimeType(file: File): string;
//# sourceMappingURL=utils.d.ts.map