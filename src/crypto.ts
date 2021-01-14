import { pki, pkcs5, md } from "node-forge";
import blake from "blakejs";
import { RegistryEntry } from "./registry";
import { assertUint64, stringToUint8Array, toHexString } from "./utils";
import randomBytes from "randombytes";

export type PublicKey = pki.ed25519.NativeBuffer;
export type SecretKey = pki.ed25519.NativeBuffer;
export type Signature = pki.ed25519.NativeBuffer;

/**
 * Key pair.
 *
 * @property publicKey - The public key.
 * @property privateKey - The private key.
 */
export type KeyPair = {
  publicKey: string;
  privateKey: string;
};

/**
 * Key pair and seed.
 *
 * @property seed - The secure seed.
 */
export type KeyPairAndSeed = KeyPair & {
  seed: string;
};

/**
 * Returns a blake2b 256bit hasher. See `NewHash` in Sia.
 *
 * @returns - blake2b 256bit hasher.
 */
function newHash() {
  return blake.blake2bInit(32, null);
}

/**
 * Takes all given arguments and hashes them.
 *
 * @param args - Byte arrays to hash.
 * @returns - The final hash as a byte array.
 */
export function hashAll(...args: Uint8Array[]): Uint8Array {
  const hasher = newHash();
  for (let i = 0; i < args.length; i++) {
    blake.blake2bUpdate(hasher, args[i]);
  }
  return blake.blake2bFinal(hasher);
}

/**
 * Hash the given data key.
 *
 * @param datakey - Datakey to hash.
 * @returns - Hash of the datakey.
 */
export function hashDataKey(datakey: string): Uint8Array {
  return hashAll(encodeString(datakey));
}

/**
 * Hashes the given registry entry.
 *
 * @param registryEntry - Registry entry to hash.
 * @returns - Hash of the registry entry.
 */
export function hashRegistryEntry(registryEntry: RegistryEntry): Uint8Array {
  return hashAll(
    hashDataKey(registryEntry.datakey),
    encodeString(registryEntry.data),
    encodeBigintAsUint64(registryEntry.revision)
  );
}

/**
 * Converts the given number into a uint8 array
 *
 * @param num - Number to encode.
 * @returns - Number encoded as a byte array.
 */
function encodeNumber(num: number): Uint8Array {
  const encoded = new Uint8Array(8);
  for (let index = 0; index < encoded.length; index++) {
    const byte = num & 0xff;
    encoded[index] = byte;
    num = num >> 8;
  }
  return encoded;
}

/**
 * Converts the given bigint into a uint8 array.
 *
 * @param int - Bigint to encode.
 * @returns - Bigint encoded as a byte array.
 * @throws - Will throw if the int does not fit in 64 bits.
 */
export function encodeBigintAsUint64(int: bigint): Uint8Array {
  // Assert the input is 64 bits.
  assertUint64(int);

  const encoded = new Uint8Array(8);
  for (let index = 0; index < encoded.length; index++) {
    const byte = int & BigInt(0xff);
    encoded[index] = Number(byte);
    int = int >> BigInt(8);
  }
  return encoded;
}

/**
 * Converts the given string into a uint8 array.
 *
 * @param str - String to encode.
 * @returns - String encoded as a byte array.
 */
function encodeString(str: string): Uint8Array {
  const encoded = new Uint8Array(8 + str.length);
  encoded.set(encodeNumber(str.length));
  encoded.set(stringToUint8Array(str), 8);
  return encoded;
}

/**
 * Derives a child seed from the given master seed and sub seed.
 *
 * @param masterSeed - The master seed to derive from.
 * @param seed - The sub seed for the derivation.
 * @returns - The child seed derived from `masterSeed` using `seed`.
 * @throws - Will throw if the inputs are not strings.
 */
export function deriveChildSeed(masterSeed: string, seed: string): string {
  /* istanbul ignore next */
  if (typeof masterSeed !== "string") {
    throw new Error(`Expected parameter masterSeed to be type string, was type ${typeof masterSeed}`);
  }
  /* istanbul ignore next */
  if (typeof seed !== "string") {
    throw new Error(`Expected parameter seed to be type string, was type ${typeof seed}`);
  }

  return toHexString(hashAll(encodeString(masterSeed), encodeString(seed)));
}

/**
 * Generates a master key pair and seed.
 *
 * @param [length=64] - The number of random bytes for the seed. Note that the string seed will be converted to hex representation, making it twice this length.
 * @returns - The generated key pair and seed.
 */
export function genKeyPairAndSeed(length = 64): KeyPairAndSeed {
  const seed = makeSeed(length);
  return { ...genKeyPairFromSeed(seed), seed };
}

/**
 * Generates a public and private key from a provided, secure seed.
 *
 * @param seed - A secure seed.
 * @returns - The generated key pair.
 * @throws - Will throw if the input is not a string.
 */
export function genKeyPairFromSeed(seed: string): KeyPair {
  /* istanbul ignore next */
  if (typeof seed !== "string") {
    throw new Error(`Expected parameter seed to be type string, was type ${typeof seed}`);
  }

  // Get a 32-byte seed.
  seed = pkcs5.pbkdf2(seed, "", 1000, 32, md.sha256.create());
  const { publicKey, privateKey } = pki.ed25519.generateKeyPair({ seed });
  return { publicKey: toHexString(publicKey), privateKey: toHexString(privateKey) };
}

/**
 * Generates a random seed of the given length in bytes.
 *
 * @param length - Length of the seed in bytes.
 * @returns - The generated seed.
 */
function makeSeed(length: number): string {
  // Cryptographically-secure random number generator. It should use the
  // built-in crypto.getRandomValues in the browser.
  const array = randomBytes(length);
  return toHexString(array);
}
