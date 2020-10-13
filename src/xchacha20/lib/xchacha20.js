"use strict";

import { HChaCha20 } from "./hchacha20";
import { Buffer } from "buffer";

export class XChaCha20 {
  constructor() {
    this.hchacha20 = new HChaCha20();
  }

  /**
   *
   * @param {Number} length
   * @param {string|Buffer} key
   * @param {string|Buffer} nonce
   * @param {Number|Buffer} counter
   */
  async streamBytes(length, key, nonce, counter = 1) {
    let outnonce = Buffer.alloc(12, 0);
    nonce.slice(16).copy(outnonce, 4);
    return await this.hchacha20.ietfStream(
      length,
      await this.hchacha20.hChaCha20Bytes(nonce.slice(0, 16), key),
      outnonce,
      counter
    );
  }

  /**
   * Encryption (defers to streamXorIc)
   *
   * @param {string|Buffer} message
   * @param {string|Buffer} nonce
   * @param {string|Buffer} key
   * @param {Number|Buffer} counter
   */
  async encrypt(message, nonce, key, counter = 1) {
    return await this.streamXorIc(message, nonce, key, counter);
  }

  /**
   * Decryption (defers to streamXorIc)
   *
   * @param {string|Buffer} message
   * @param {string|Buffer} nonce
   * @param {string|Buffer} key
   * @param {Number|Buffer} counter
   */
  async decrypt(message, nonce, key, counter = 1) {
    return await this.streamXorIc(message, nonce, key, counter);
  }

  /**
   * @param {string|Buffer} message
   * @param {string|Buffer} nonce
   * @param {string|Buffer} key
   * @param {Number|Buffer} counter
   */
  async streamXorIc(message, nonce, key, counter = 1) {
    if (key.length !== 32) {
      throw new Error("Key must be 32 bytes");
    }
    if (nonce.length !== 24) {
      throw new Error("Nonce must be 24 bytes");
    }
    let outnonce = Buffer.alloc(12, 0);
    nonce.slice(16).copy(outnonce, 4);
    return await this.hchacha20.ietfStreamXorIc(
      message,
      outnonce,
      await this.hchacha20.hChaCha20Bytes(nonce.slice(0, 16), key),
      counter
    );
  }
}
