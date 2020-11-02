"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SkynetClient = void 0;
var axios_1 = __importDefault(require("axios"));
var upload_1 = require("./upload");
var encryption_1 = require("./encryption");
var download_1 = require("./download");
var skydb_1 = require("./skydb");
var registry_1 = require("./registry");
var utils_1 = require("./utils");
var SkynetClient = /** @class */ (function () {
    /**
     * The Skynet Client which can be used to access Skynet.
     * @param [portalUrl] The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use ""
     * @param [customOptions] Configuration for the client
     */
    function SkynetClient(portalUrl, customOptions) {
        if (portalUrl === void 0) { portalUrl = utils_1.defaultPortalUrl(); }
        if (customOptions === void 0) { customOptions = {}; }
        this.uploadFile = upload_1.uploadFile;
        this.uploadDirectory = upload_1.uploadDirectory;
        this.uploadDirectoryRequest = upload_1.uploadDirectoryRequest;
        this.uploadFileRequest = upload_1.uploadFileRequest;
        this.addSkykey = encryption_1.addSkykey;
        this.createSkykey = encryption_1.createSkykey;
        this.getSkykeyById = encryption_1.getSkykeyById;
        this.getSkykeyByName = encryption_1.getSkykeyByName;
        this.getSkykeys = encryption_1.getSkykeys;
        this.downloadFile = download_1.downloadFile;
        this.downloadFileHns = download_1.downloadFileHns;
        this.getSkylinkUrl = download_1.getSkylinkUrl;
        this.getHnsUrl = download_1.getHnsUrl;
        this.getHnsresUrl = download_1.getHnsresUrl;
        this.getMetadata = download_1.getMetadata;
        this.openFile = download_1.openFile;
        this.openFileHns = download_1.openFileHns;
        this.resolveHns = download_1.resolveHns;
        // SkyDB
        this.db = {
            getJSON: skydb_1.getJSON.bind(this),
            setJSON: skydb_1.setJSON.bind(this)
        };
        // SkyDB helpers
        this.registry = {
            getEntry: registry_1.getEntry.bind(this),
            setEntry: registry_1.setEntry.bind(this)
        };
        this.portalUrl = portalUrl;
        this.customOptions = customOptions;
    }
    /**
     * Creates and executes a request.
     * @param {Object} config - Configuration for the request. See docs for constructor for the full list of options.
     */
    SkynetClient.prototype.executeRequest = function (config) {
        var _a;
        var url = config.url;
        if (!url) {
            url = utils_1.makeUrl(this.portalUrl, config.endpointPath, (_a = config.extraPath) !== null && _a !== void 0 ? _a : "");
            url = utils_1.addUrlQuery(url, config.query);
        }
        // No other headers.
        var headers = config.customUserAgent && { "User-Agent": config.customUserAgent };
        return axios_1["default"]({
            url: url,
            method: config.method,
            data: config.data,
            headers: headers,
            auth: config.APIKey && { username: "", password: config.APIKey },
            onUploadProgress: config.onUploadProgress &&
                function (event) {
                    var progress = event.loaded / event.total;
                    config.onUploadProgress(progress, event);
                },
            timeout: config.timeout
        });
    };
    return SkynetClient;
}());
exports.SkynetClient = SkynetClient;
