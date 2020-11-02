"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.resolveHns = exports.openFileHns = exports.openFile = exports.getMetadata = exports.getHnsresUrl = exports.getHnsUrl = exports.getSkylinkUrl = exports.downloadFileHns = exports.downloadFile = void 0;
var utils_1 = require("./utils");
var defaultDownloadOptions = __assign({}, utils_1.defaultOptions("/"));
var defaultDownloadHnsOptions = __assign({}, utils_1.defaultOptions("/hns"));
var defaultResolveHnsOptions = __assign({}, utils_1.defaultOptions("/hnsres"));
/**
 * Initiates a download of the content of the skylink within the browser.
 * @param {string} skylink - 46 character skylink.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 */
function downloadFile(skylink, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var opts = __assign(__assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions), { download: true });
    var url = this.getSkylinkUrl(skylink, opts);
    // Download the url.
    window.location.assign(url);
}
exports.downloadFile = downloadFile;
/**
 * Initiates a download of the content of the skylink at the Handshake domain.
 * @param {string} domain - Handshake domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hns"] - The relative URL path of the portal endpoint to contact.
 */
function downloadFileHns(domain, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var opts, url;
        return __generator(this, function (_a) {
            opts = __assign(__assign(__assign(__assign({}, defaultDownloadHnsOptions), this.customOptions), customOptions), { download: true });
            url = this.getHnsUrl(domain, opts);
            // Download the url.
            window.location.assign(url);
            return [2 /*return*/];
        });
    });
}
exports.downloadFileHns = downloadFileHns;
function getSkylinkUrl(skylink, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
    var query = opts.download ? { attachment: true } : {};
    var url = utils_1.makeUrl(this.portalUrl, opts.endpointPath, utils_1.parseSkylink(skylink));
    return utils_1.addUrlQuery(url, query);
}
exports.getSkylinkUrl = getSkylinkUrl;
function getHnsUrl(domain, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var opts = __assign(__assign(__assign({}, defaultDownloadHnsOptions), this.customOptions), customOptions);
    var query = opts.download ? { attachment: true } : {};
    var url = utils_1.makeUrl(this.portalUrl, opts.endpointPath, utils_1.trimUriPrefix(domain, utils_1.uriHandshakePrefix));
    return utils_1.addUrlQuery(url, query);
}
exports.getHnsUrl = getHnsUrl;
function getHnsresUrl(domain, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var opts = __assign(__assign(__assign({}, defaultResolveHnsOptions), this.customOptions), customOptions);
    return utils_1.makeUrl(this.portalUrl, opts.endpointPath, utils_1.trimUriPrefix(domain, utils_1.uriHandshakeResolverPrefix));
}
exports.getHnsresUrl = getHnsresUrl;
function getMetadata(skylink, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var opts, url, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
                    url = this.getSkylinkUrl(skylink, opts);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "head", url: url }))];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.headers["skynet-file-metadata"] ? JSON.parse(response.headers["skynet-file-metadata"]) : {}];
                case 3:
                    error_1 = _a.sent();
                    throw new Error("Error getting skynet-file-metadata from skylink");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getMetadata = getMetadata;
/**
 * Opens the content of the skylink within the browser.
 * @param {string} skylink - 46 character skylink.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 */
function openFile(skylink, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
    var url = this.getSkylinkUrl(skylink, opts);
    window.open(url, "_blank");
}
exports.openFile = openFile;
/**
 * Opens the content of the skylink from the given Handshake domain within the browser.
 * @param {string} domain - Handshake domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hns"] - The relative URL path of the portal endpoint to contact.
 */
function openFileHns(domain, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var opts, url;
        return __generator(this, function (_a) {
            opts = __assign(__assign(__assign({}, defaultDownloadHnsOptions), this.customOptions), customOptions);
            url = this.getHnsUrl(domain, opts);
            // Open the url in a new tab.
            window.open(url, "_blank");
            return [2 /*return*/];
        });
    });
}
exports.openFileHns = openFileHns;
/**
 * @param {string} domain - Handshake resolver domain.
 * @param {Object} [customOptions={}] - Additional settings that can optionally be set.
 * @param {string} [customOptions.endpointPath="/hnsres"] - The relative URL path of the portal endpoint to contact.
 */
function resolveHns(domain, customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var opts, url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultResolveHnsOptions), this.customOptions), customOptions);
                    url = this.getHnsresUrl(domain, opts);
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "get", url: url }))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
exports.resolveHns = resolveHns;
