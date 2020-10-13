import { areEqualUint8Arrays } from "../utils";
import { XChaCha20CipherKey } from "./xchacha20";
import { PlainTextCipherKey } from "./plaintext";

const errInvalidCipherType = "provided cipher type is invalid";

/**
 * Represents an invalid type which cannot be used for any meaningful purpose.
 */
export const typeInvalid = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
/**
 * Means no encryption is used.
 */
const typePlain = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
// /**
//  * The type for the Twofish-GCM encryption.
//  */
// const typeTwofish = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 2]);
// /**
//  * The type for the Threefish encryption.
//  */
// const typeThreefish = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 3]);
/**
 * The type for the XChaCha20 encryption.
 */
export const typeXChaCha20 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 4]);

export type cipherType = Uint8Array;

export type ciphertext = Uint8Array;

export interface CipherKey {
  key(): Uint8Array;
  decryptBytes(ct: ciphertext): Promise<Uint8Array>;
}

/**
 * Creates a new SiaKey from the provided type and entropy.
 */
export function newSiaKey(ct: cipherType, entropy: Uint8Array): CipherKey {
  if (areEqualUint8Arrays(ct, typePlain)) {
    return new PlainTextCipherKey();
  }
  // case TypeTwofish:
  //   return newTwofishKey(entropy);
  // case TypeThreefish:
  //   return newThreefishKey(entropy);
  if (areEqualUint8Arrays(ct, typeXChaCha20)) {
    return new XChaCha20CipherKey(entropy);
  }
  throw new Error(errInvalidCipherType);
}

/**
 * Creates a new SiaKey from the provided type.
 */
export function generateSiaKey(ct: cipherType): CipherKey {
  if (areEqualUint8Arrays(ct, typePlain)) {
    return new PlainTextCipherKey();
  }
  // case TypeTwofish:
  //   return newTwofishKey(entropy);
  // case TypeThreefish:
  //   return newThreefishKey(entropy);
  if (areEqualUint8Arrays(ct, typeXChaCha20)) {
    return new XChaCha20CipherKey();
  }
  throw new Error(errInvalidCipherType);
}
