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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.keyPairFromSeed = exports.generateKeyPairAndSeed = exports.deriveChildSeed = exports.HashRegistryEntry = exports.HashDataKey = exports.HashAll = void 0;
var node_forge_1 = require("node-forge");
var blakejs_1 = __importDefault(require("blakejs"));
var utils_1 = require("./utils");
// NewHash returns a blake2b 256bit hasher.
function NewHash() {
    return blakejs_1["default"].blake2bInit(32, null);
}
// HashAll takes all given arguments and hashes them.
function HashAll() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var h = NewHash();
    for (var i = 0; i < args.length; i++) {
        blakejs_1["default"].blake2bUpdate(h, args[i]);
    }
    return blakejs_1["default"].blake2bFinal(h);
}
exports.HashAll = HashAll;
// Hash the given data key.
function HashDataKey(datakey) {
    return HashAll(encodeString(datakey));
}
exports.HashDataKey = HashDataKey;
// Hashes the given registry entry.
function HashRegistryEntry(registryEntry) {
    return HashAll(HashDataKey(registryEntry.datakey), encodeString(registryEntry.data), encodeNumber(registryEntry.revision));
}
exports.HashRegistryEntry = HashRegistryEntry;
// encodeNumber converts the given number into a uint8 array
function encodeNumber(num) {
    var encoded = new Uint8Array(8);
    for (var index = 0; index < encoded.length; index++) {
        var byte = num & 0xff;
        encoded[index] = byte;
        num = num >> 8;
    }
    return encoded;
}
// encodeString converts the given string into a uint8 array
function encodeString(str) {
    var encoded = new Uint8Array(8 + str.length);
    encoded.set(encodeNumber(str.length));
    encoded.set(utils_1.stringToUint8Array(str), 8);
    return encoded;
}
function deriveChildSeed(masterSeed, seed) {
    return HashAll(masterSeed, seed).toString();
}
exports.deriveChildSeed = deriveChildSeed;
/**
 * Generates a master key pair and seed.
 * @param [length=64] - The number of random bytes for the seed. Note that the string seed will be converted to hex representation, making it twice this length.
 */
function generateKeyPairAndSeed(length) {
    var seed = makeSeed(length);
    return __assign(__assign({}, keyPairFromSeed(seed)), { seed: seed });
}
exports.generateKeyPairAndSeed = generateKeyPairAndSeed;
/**
 * Generates a public and private key from a provided, secure seed.
 * @param seed - A secure seed.
 */
function keyPairFromSeed(seed) {
    // Get a 32-byte seed.
    seed = node_forge_1.pkcs5.pbkdf2(seed, "", 1000, 32, node_forge_1.md.sha256.create());
    return node_forge_1.pki.ed25519.generateKeyPair({ seed: seed });
}
exports.keyPairFromSeed = keyPairFromSeed;
function makeSeed(length) {
    var array = new Uint8Array(length);
    // Use built-in cryptographically-secure random number generator.
    window.crypto.getRandomValues(array);
    return Buffer.from(array).toString("hex");
}
