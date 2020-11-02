import { pki } from "node-forge";
import { RegistryEntry } from "./registry";
export declare type PublicKey = pki.ed25519.NativeBuffer;
export declare type SecretKey = pki.ed25519.NativeBuffer;
export declare type Signature = pki.ed25519.NativeBuffer;
export declare function HashAll(...args: any[]): Uint8Array;
export declare function HashDataKey(datakey: string): Uint8Array;
export declare function HashRegistryEntry(registryEntry: RegistryEntry): Uint8Array;
export declare function deriveChildSeed(masterSeed: string, seed: string): string;
/**
 * Generates a master key pair and seed.
 * @param [length=64] - The number of random bytes for the seed. Note that the string seed will be converted to hex representation, making it twice this length.
 */
export declare function generateKeyPairAndSeed(length?: 64): {
    publicKey: PublicKey;
    privateKey: SecretKey;
    seed: string;
};
/**
 * Generates a public and private key from a provided, secure seed.
 * @param seed - A secure seed.
 */
export declare function keyPairFromSeed(seed: string): {
    publicKey: PublicKey;
    privateKey: SecretKey;
};
//# sourceMappingURL=crypto.d.ts.map