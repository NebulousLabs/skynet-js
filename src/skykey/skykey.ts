import * as crypto from "../crypto/crypto";
import { HashAll } from "../crypto/hash";
import * as types from "../types";
import { areEqualUint8Arrays, concatUint8Arrays, fillRandUint8Array } from "../utils";
import * as chacha from "../crypto/xchacha20";

const errInvalidIDorNonceLength = "Invalid length for encryptionID or nonce in MatchesSkyfileEncryptionID";

/**
 * errNoSkykeysWithThatID indicates that the skykey manager doesn't have a key
 * with that ID.
 */
export const errNoSkykeysWithThatID = "No Skykey is associated with that ID";

export const errUnsupportedSkykeyType = "Unsupported Skykey type";

/**
 * The maximum length of a skykey's name.
 */
export const maxKeyNameLen = 128;

/**
 * The length of a SkykeyID.
 */
export const skykeyIDLen = 16;

/**
 * Type for a Skykey that uses XChaCha20. It reveals its
 * skykey ID in *every* skyfile it encrypts.
 */
export const typePublicID = 1;

/**
 * Type for a Skykey that uses XChaCha20 that does not reveal its skykey ID when
 * encrypting Skyfiles. Instead, it marks the skykey used for encryption by
 * storing an encrypted identifier that can only be successfully decrypted with
 * the correct skykey.
 */
export const typePrivateID = 2;

/**
 * Used as a prefix when hashing Skykeys to compute their ID.
 */
const skykeySpecifier = types.newSpecifier("Skykey");
const skyfileEncryptionIDSpecifier = types.newSpecifier("SkyfileEncID");
const skyfileEncryptionIDDerivation = types.newSpecifier("SFEncIDDerivPath");

export type skykeyType = number;

export type skykeyID = Uint8Array;

export function cipherType(t: skykeyType): crypto.cipherType {
  if (t == typePublicID || t == typePrivateID) {
    return crypto.typeXChaCha20;
  }
  return crypto.typeInvalid;
}

/**
 * A key used to encrypt/decrypt skyfiles.
 */
export class Skykey {
  name: string;
  keyType: skykeyType;
  entropy: Uint8Array;

  constructor(name: string, keyType: skykeyType, entropy: Uint8Array) {
    this.name = name;
    this.keyType = keyType;
    this.entropy = entropy;
  }

  /**
   * Returns the ID for the Skykey. A master Skykey and all file-specific skykeys
   * derived from it share the same ID because they only differ in nonce values,
   * not key values. This fact is used to identify the master Skykey with which a
   * Skyfile was encrypted.
   */
  id() {
    let entropy = this.entropy;

    if ((this.keyType == typePublicID || this.keyType, typePrivateID)) {
      // Ignore the nonce for this type because the nonce is different for each
      // file-specific subkey.
      entropy = this.entropy.slice(0, chacha.keySize);
    } else {
      throw new Error(`Computing ID with skykey of unknown type: ${this.keyType}`);
    }

    const h = HashAll(skykeySpecifier, this.keyType, entropy);
    return h.slice(0, skykeyIDLen);
  }

  /**
   * Returns the crypto.CipherType used by this Skykey.
   */
  cipherType(): crypto.cipherType {
    return cipherType(this.keyType);
  }

  /**
   * Creates a new subkey specific to a certain file being uploaded/downloaded.
   * Skykeys can only be used once with a given nonce, so this method is used to
   * generate keys with new nonces when a new file is uploaded.
   */
  generateFileSpecificSubkey(): Skykey {
    // Generate a new random nonce.
    const nonce = new Uint8Array(chacha.xNonceSize);
    fillRandUint8Array(nonce);
    return this.subkeyWithNonce(nonce);
  }

  /**
   * Used to create Skykeys with the same key, but with a different nonce. This
   * is used to create file-specific keys, and separate keys for Skyfile
   * baseSector uploads and fanout uploads.
   */
  deriveSubkey(derivation: Uint8Array): Skykey {
    const nonce = this.nonce();
    const derivedNonceHash = HashAll(nonce, derivation);
    // Truncate the hash to a nonce.
    const derivedNonce = derivedNonceHash.slice(0, chacha.xNonceSize);

    return this.subkeyWithNonce(derivedNonce);
  }

  /**
   * Creates a new subkey with the same key data as this key, but with the given
   * nonce.
   */
  subkeyWithNonce(nonce: Uint8Array) {
    if (nonce.length != chacha.xNonceSize) {
      throw new Error("Incorrect nonce size");
    }

    const keyArray = this.entropy.slice(0, chacha.keySize);
    const entropy = concatUint8Arrays(keyArray, nonce);

    // Sanity check that we can actually make a CipherKey with this. If not, an
    // error will be thrown.
    crypto.newSiaKey(this.cipherType(), entropy);

    return new Skykey(this.name, this.keyType, entropy);
  }

  /**
   * Returns true if and only if the skykey was the one used with this nonce to
   * create the encryptionID.
   */
  async matchesSkyfileEncryptionID(encryptionID: Uint8Array, nonce: Uint8Array): Promise<boolean> {
    if (encryptionID.length != skykeyIDLen || nonce.length != chacha.xNonceSize) {
      throw new Error(errInvalidIDorNonceLength);
    }
    // This only applies to TypePrivateID keys.
    if (this.keyType != typePrivateID) {
      return false;
    }

    // Create the subkey for the encryption ID.
    const fileSkykey = this.subkeyWithNonce(nonce);
    const encIDSkykey = fileSkykey.deriveSubkey(skyfileEncryptionIDDerivation);

    // Decrypt the identifier and check that it matches the skyfile encryption
    // ID specifier.
    const cipherKey = encIDSkykey.cipherKey();
    const plaintextBytes = await cipherKey.decryptBytes(encryptionID);
    if (areEqualUint8Arrays(plaintextBytes, skyfileEncryptionIDSpecifier)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the crypto.CipherKey equivalent of this Skykey.
   */
  cipherKey(): crypto.CipherKey {
    return crypto.newSiaKey(this.cipherType(), this.entropy);
  }

  /**
   * Returns the nonce of this Skykey.
   */
  nonce(): Uint8Array {
    return new Uint8Array(this.entropy, chacha.keySize, chacha.xNonceSize);
  }
}
