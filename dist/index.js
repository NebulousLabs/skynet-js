"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.uriSkynetPrefix = exports.uriHandshakeResolverPrefix = exports.uriHandshakePrefix = exports.parseSkylink = exports.getRootDirectory = exports.getRelativeFilePath = exports.defaultSkynetPortalUrl = exports.defaultPortalUrl = exports.keyPairFromSeed = exports.generateKeyPairAndSeed = exports.deriveChildSeed = exports.SkynetClient = void 0;
var client_1 = require("./client");
__createBinding(exports, client_1, "SkynetClient");
var crypto_1 = require("./crypto");
__createBinding(exports, crypto_1, "deriveChildSeed");
__createBinding(exports, crypto_1, "generateKeyPairAndSeed");
__createBinding(exports, crypto_1, "keyPairFromSeed");
var utils_1 = require("./utils");
__createBinding(exports, utils_1, "defaultPortalUrl");
__createBinding(exports, utils_1, "defaultSkynetPortalUrl");
__createBinding(exports, utils_1, "getRelativeFilePath");
__createBinding(exports, utils_1, "getRootDirectory");
__createBinding(exports, utils_1, "parseSkylink");
__createBinding(exports, utils_1, "uriHandshakePrefix");
__createBinding(exports, utils_1, "uriHandshakeResolverPrefix");
__createBinding(exports, utils_1, "uriSkynetPrefix");
