"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getFileMimeType = exports.readData = exports.hexToUint8Array = exports.stringToUint8Array = exports.randomNumber = exports.trimUriPrefix = exports.parseSkylink = exports.makeUrl = exports.getRootDirectory = exports.getRelativeFilePath = exports.defaultPortalUrl = exports.defaultOptions = exports.addUrlQuery = exports.uriSkynetPrefix = exports.uriHandshakeResolverPrefix = exports.uriHandshakePrefix = exports.defaultSkynetPortalUrl = void 0;
var mime_db_1 = __importDefault(require("mime-db"));
var path_browserify_1 = __importDefault(require("path-browserify"));
var url_parse_1 = __importDefault(require("url-parse"));
var url_join_1 = __importDefault(require("url-join"));
var buffer_1 = require("buffer");
exports.defaultSkynetPortalUrl = "https://siasky.net";
exports.uriHandshakePrefix = "hns:";
exports.uriHandshakeResolverPrefix = "hnsres:";
exports.uriSkynetPrefix = "sia:";
function addUrlQuery(url, query) {
    var parsed = url_parse_1["default"](url);
    parsed.set("query", query);
    return parsed.toString();
}
exports.addUrlQuery = addUrlQuery;
function defaultOptions(endpointPath) {
    return {
        endpointPath: endpointPath,
        APIKey: "",
        customUserAgent: ""
    };
}
exports.defaultOptions = defaultOptions;
// TODO: This will be smarter. See
// https://github.com/NebulousLabs/skynet-docs/issues/21.
function defaultPortalUrl() {
    if (typeof window === "undefined")
        return "/"; // default to path root on ssr
    return window.location.origin;
}
exports.defaultPortalUrl = defaultPortalUrl;
function getFilePath(file) {
    return file.webkitRelativePath || file.path || file.name;
}
function getRelativeFilePath(file) {
    var filePath = getFilePath(file);
    var _a = path_browserify_1["default"].parse(filePath), root = _a.root, dir = _a.dir, base = _a.base;
    var relative = path_browserify_1["default"].normalize(dir).slice(root.length).split(path_browserify_1["default"].sep).slice(1);
    return path_browserify_1["default"].join.apply(path_browserify_1["default"], __spreadArrays(relative, [base]));
}
exports.getRelativeFilePath = getRelativeFilePath;
function getRootDirectory(file) {
    var filePath = getFilePath(file);
    var _a = path_browserify_1["default"].parse(filePath), root = _a.root, dir = _a.dir;
    return path_browserify_1["default"].normalize(dir).slice(root.length).split(path_browserify_1["default"].sep)[0];
}
exports.getRootDirectory = getRootDirectory;
/**
 * Properly joins paths together to create a URL. Takes a variable number of
 * arguments.
 */
function makeUrl() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, cur) { return url_join_1["default"](acc, cur); });
}
exports.makeUrl = makeUrl;
var SKYLINK_MATCHER = "([a-zA-Z0-9_-]{46})";
var SKYLINK_DIRECT_REGEX = new RegExp("^" + SKYLINK_MATCHER + "$");
var SKYLINK_PATHNAME_REGEX = new RegExp("^/?" + SKYLINK_MATCHER + "([/?].*)?$");
var SKYLINK_REGEXP_MATCH_POSITION = 1;
function parseSkylink(skylink) {
    if (typeof skylink !== "string")
        throw new Error("Skylink has to be a string, " + typeof skylink + " provided");
    // check for direct skylink match
    var matchDirect = skylink.match(SKYLINK_DIRECT_REGEX);
    if (matchDirect)
        return matchDirect[SKYLINK_REGEXP_MATCH_POSITION];
    // check for skylink prefixed with sia: or sia:// and extract it
    // example: sia:XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    // example: sia://XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    skylink = trimUriPrefix(skylink, exports.uriSkynetPrefix);
    // check for skylink passed in an url and extract it
    // example: https://siasky.net/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    // pass empty object as second param to disable using location as base url when parsing in browser
    var parsed = url_parse_1["default"](skylink, {});
    var matchPathname = parsed.pathname.match(SKYLINK_PATHNAME_REGEX);
    if (matchPathname)
        return matchPathname[SKYLINK_REGEXP_MATCH_POSITION];
    throw new Error("Could not extract skylink from '" + skylink + "'");
}
exports.parseSkylink = parseSkylink;
function trimUriPrefix(str, prefix) {
    var longPrefix = prefix + "//";
    if (str.startsWith(longPrefix)) {
        // longPrefix is exactly at the beginning
        return str.slice(longPrefix.length);
    }
    if (str.startsWith(prefix)) {
        // else prefix is exactly at the beginning
        return str.slice(prefix.length);
    }
    return str;
}
exports.trimUriPrefix = trimUriPrefix;
function randomNumber(low, high) {
    return Math.random() * (high - low) + low;
}
exports.randomNumber = randomNumber;
// stringToUint8Array converts a string to a uint8 array
function stringToUint8Array(str) {
    return Uint8Array.from(buffer_1.Buffer.from(str));
}
exports.stringToUint8Array = stringToUint8Array;
// hexToUint8Array converts a hex encoded string to a uint8 array
function hexToUint8Array(str) {
    return new Uint8Array(str.match(/.{1,2}/g).map(function (byte) { return parseInt(byte, 16); }));
}
exports.hexToUint8Array = hexToUint8Array;
// readData is a helper function that uses a FileReader to read the contents of
// the given file
function readData(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () { return resolve(reader.result); };
        reader.onerror = function (error) { return reject(error); };
    });
}
exports.readData = readData;
/**
 * Get the file mime type. In case the type is not provided, use mime-db and try
 * to guess the file type based on the extension.
 */
function getFileMimeType(file) {
    var _a, _b;
    if (file.type)
        return file.type;
    var extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (extension) {
        for (var type in mime_db_1["default"]) {
            if ((_b = (_a = mime_db_1["default"][type]) === null || _a === void 0 ? void 0 : _a.extensions) === null || _b === void 0 ? void 0 : _b.includes(extension)) {
                return type;
            }
        }
    }
    return "";
}
exports.getFileMimeType = getFileMimeType;
