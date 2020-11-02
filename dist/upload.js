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
exports.uploadDirectoryRequest = exports.uploadDirectory = exports.uploadFileRequest = exports.uploadFile = void 0;
var utils_1 = require("./utils");
var defaultUploadOptions = __assign(__assign({}, utils_1.defaultOptions("/skynet/skyfile")), { portalFileFieldname: "file", portalDirectoryFileFieldname: "files[]", customFilename: "" });
function uploadFile(file, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.uploadFileRequest(file, customOptions)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, "" + utils_1.uriSkynetPrefix + response.skylink];
            }
        });
    });
}
exports.uploadFile = uploadFile;
function uploadFileRequest(file, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, formData, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultUploadOptions), this.customOptions), customOptions);
                    formData = new FormData();
                    file = ensureFileObjectConsistency(file);
                    if (opts.customFilename) {
                        formData.append(opts.portalFileFieldname, file, opts.customFilename);
                    }
                    else {
                        formData.append(opts.portalFileFieldname, file);
                    }
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "post", data: formData }))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.uploadFileRequest = uploadFileRequest;
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
function uploadDirectory(directory, filename, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.uploadDirectoryRequest(directory, filename, customOptions)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, "" + utils_1.uriSkynetPrefix + response.skylink];
            }
        });
    });
}
exports.uploadDirectory = uploadDirectory;
function uploadDirectoryRequest(directory, filename, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, formData, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultUploadOptions), this.customOptions), customOptions);
                    formData = new FormData();
                    Object.entries(directory).forEach(function (_a) {
                        var path = _a[0], file = _a[1];
                        file = ensureFileObjectConsistency(file);
                        formData.append(opts.portalDirectoryFileFieldname, file, path);
                    });
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "post", data: formData, query: { filename: filename } }))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.uploadDirectoryRequest = uploadDirectoryRequest;
/**
 * Sometimes file object might have had the type property defined manually with
 * Object.defineProperty and some browsers (namely firefox) can have problems
 * reading it after the file has been appended to form data. To overcome this,
 * we recreate the file object using native File constructor with a type defined
 * as a constructor argument.
 * Related issue: https://github.com/NebulousLabs/skynet-webportal/issues/290
 */
function ensureFileObjectConsistency(file) {
    return new File([file], file.name, { type: utils_1.getFileMimeType(file) });
}
