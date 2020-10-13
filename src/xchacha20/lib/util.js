"use strict";

import arrayToBuffer from "typedarray-to-buffer";
import crypto from "crypto";
import { Buffer } from "buffer";

/**
 * @type {module.Util}
 */
export class Util {
  /**
   * @param {Buffer} buf
   * @return {Uint32Array}
   */
  static bufferToUint32Array(buf) {
    let arr = [];
    let len = buf.length >>> 2;
    for (let i = 0; i < len; i++) {
      arr.push(Util.load32_be(buf.slice(i << 2, (i << 2) + 4)));
    }
    return Uint32Array.from(arr);
  }
  /**
   * @param {Buffer} buf
   * @return {Uint32Array}
   */
  static bufferToUint32LEArray(buf) {
    let arr = [];
    let len = buf.length >>> 2;
    for (let i = 0; i < len; i++) {
      arr.push(Util.load32_le(buf.slice(i << 2, (i << 2) + 4)));
    }
    return Uint32Array.from(arr);
  }

  /**
   * Gets the string representation of a Buffer.
   *
   * @param {Buffer} buffer
   * @returns {string}
   */
  static fromBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Invalid type; string or buffer expected");
    }
    return buffer.toString("binary");
  }

  /**
   * Compare two strings without timing leaks.
   *
   * @param {string|Buffer} a
   * @param {string|Buffer} b
   * @returns {boolean}
   */
  static hashEquals(a, b) {
    return crypto.timingSafeEquals(a, b);
  }

  /**
   * Node.js only supports 32-bit numbers so we discard the top 4 bytes.
   *
   * @param {Buffer} buf
   * @return {Number}
   */
  static load32_le(buf) {
    return buf.readInt32LE(0) >>> 0;
  }

  /**
   * Node.js only supports 32-bit numbers so we discard the top 4 bytes.
   *
   * @param {Buffer} buf
   * @return {Number}
   */
  static load32_be(buf) {
    return buf.readInt32BE(0) >>> 0;
  }

  /**
   * Node.js only supports 32-bit numbers so we discard the top 4 bytes.
   *
   * @param {Buffer} buf
   * @return {Number}
   */
  static load64_le(buf) {
    return buf.readInt32LE(0) >>> 0;
  }

  /**
   * Pack chunks together for feeding into HMAC.
   *
   * @param {Buffer[]} pieces
   * @return Buffer
   */
  static pack(pieces) {
    let output = Util.store32_le(pieces.length);
    let piece;
    let pieceLen;
    for (let i = 0; i < pieces.length; i++) {
      piece = pieces[i];
      pieceLen = Util.store64_le(piece.length);
      output = Buffer.concat([output, pieceLen, piece]);
    }
    return output;
  }

  /**
   * Store a 32-bit integer as a buffer of length 4
   *
   * @param {Number} num
   * @return {Buffer}
   */
  static store32_be(num) {
    let result = Buffer.alloc(4, 0);
    result[3] = (num & 0xff) >>> 0;
    result[2] = ((num >>> 8) & 0xff) >>> 0;
    result[1] = ((num >>> 16) & 0xff) >>> 0;
    result[0] = ((num >>> 24) & 0xff) >>> 0;
    return result;
  }

  /**
   * Store a 32-bit integer as a buffer of length 4
   *
   * @param {Number} num
   * @return {Buffer}
   */
  static store32_le(num) {
    let result = Buffer.alloc(4, 0);
    result[0] = num & 0xff;
    result[1] = (num >>> 8) & 0xff;
    result[2] = (num >>> 16) & 0xff;
    result[3] = (num >>> 24) & 0xff;
    return result;
  }

  /**
   * JavaScript only supports 32-bit integers, so we're going to
   * zero-fill the rightmost bytes.
   *
   * @param {Number} num
   * @return {Buffer}
   */
  static store64_le(num) {
    let result = Buffer.alloc(8, 0);
    result[0] = num & 0xff;
    result[1] = (num >>> 8) & 0xff;
    result[2] = (num >>> 16) & 0xff;
    result[3] = (num >>> 24) & 0xff;
    return result;
  }

  /**
   * Coerce input to a Buffer, throwing a TypeError if it cannot be coerced.
   *
   * @param {string|Buffer|Uint8Array|Uint32Array} stringOrBuffer
   * @returns {Buffer}
   */
  static toBuffer(stringOrBuffer) {
    if (Buffer.isBuffer(stringOrBuffer)) {
      return stringOrBuffer;
    } else if (typeof stringOrBuffer === "string") {
      return Buffer.from(stringOrBuffer, "binary");
    } else if (stringOrBuffer instanceof Uint8Array) {
      return arrayToBuffer(stringOrBuffer);
    } else if (stringOrBuffer instanceof Uint32Array) {
      return arrayToBuffer(stringOrBuffer);
    } else {
      throw new TypeError("Invalid type; string or buffer expected");
    }
  }
}
