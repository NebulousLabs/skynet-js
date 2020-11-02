import { AxiosResponse } from "axios";
import { uploadFile, uploadDirectory, uploadDirectoryRequest, uploadFileRequest } from "./upload";
import { addSkykey, createSkykey, getSkykeyById, getSkykeyByName, getSkykeys } from "./encryption";
import { downloadFile, downloadFileHns, getSkylinkUrl, getHnsUrl, getHnsresUrl, getMetadata, openFile, openFileHns, resolveHns } from "./download";
export declare type CustomClientOptions = {
    /** authentication password to use */
    APIKey?: string;
    /** custom user agent header to set */
    customUserAgent?: string;
    /** optional callback to track upload progress */
    onUploadProgress?: (progress: number, event: ProgressEvent) => void;
};
export declare class SkynetClient {
    portalUrl: string;
    customOptions: CustomClientOptions;
    /**
     * The Skynet Client which can be used to access Skynet.
     * @param [portalUrl] The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use ""
     * @param [customOptions] Configuration for the client
     */
    constructor(portalUrl?: string, customOptions?: CustomClientOptions);
    uploadFile: typeof uploadFile;
    uploadDirectory: typeof uploadDirectory;
    uploadDirectoryRequest: typeof uploadDirectoryRequest;
    uploadFileRequest: typeof uploadFileRequest;
    addSkykey: typeof addSkykey;
    createSkykey: typeof createSkykey;
    getSkykeyById: typeof getSkykeyById;
    getSkykeyByName: typeof getSkykeyByName;
    getSkykeys: typeof getSkykeys;
    downloadFile: typeof downloadFile;
    downloadFileHns: typeof downloadFileHns;
    getSkylinkUrl: typeof getSkylinkUrl;
    getHnsUrl: typeof getHnsUrl;
    getHnsresUrl: typeof getHnsresUrl;
    getMetadata: typeof getMetadata;
    openFile: typeof openFile;
    openFileHns: typeof openFileHns;
    resolveHns: typeof resolveHns;
    db: {
        getJSON: any;
        setJSON: any;
    };
    registry: {
        getEntry: any;
        setEntry: any;
    };
    /**
     * Creates and executes a request.
     * @param {Object} config - Configuration for the request. See docs for constructor for the full list of options.
     */
    executeRequest(config: any): Promise<AxiosResponse>;
}
//# sourceMappingURL=client.d.ts.map