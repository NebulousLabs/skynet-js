import { XChaCha20 } from "xchacha20-js";
import { concatUint8Arrays, randomInt } from "../utils";
import { ciphertext } from "./crypto";

export const keySize = 32;
export const xNonceSize = 24;

let xcha20 = new XChaCha20;

export class XChaCha20CipherKey {
  cipherkey: Uint8Array;
  nonce: Uint8Array;

  /**
   * Creates a new XChaCha20CipherKey from a given entropy byte array.
   */
  constructor(entropy?: Uint8Array) {
    if (entropy === undefined) {
      entropy = new Uint8Array(keySize+xNonceSize);
      for (let i = 0; i < entropy.length; i++) {
        entropy[i] = randomInt(0, 256);
      }
    }
    if (entropy.length != keySize+xNonceSize) {
      throw new Error("Incorrect entropy length for XChaCha20 cipher");
    }

    // Copy entropy into key and nonce values.
    this.cipherkey = entropy.slice(0, keySize);
    this.nonce = entropy.slice(keySize, xNonceSize);
  }

  /**
   * Returns the XChaCha20 key and nonce together. Both are returned in one slice
   * so that it may be used to create a new CipherKey with the same data.
   */
  key(): Uint8Array {
    return concatUint8Arrays(this.cipherkey, this.nonce);
  }

  /**
   * Decrypts a ciphertext created by EncryptPiece.
   */
  decryptBytes(ct: ciphertext): Uint8Array {
    // Reset the cipher key stream.
    return xcha20.streamXorIc(ct, this.nonce, this.cipherkey, 0);
  }
}
