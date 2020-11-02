import { SkynetClient } from "./client";
import { PublicKey, SecretKey, Signature } from "./crypto";
export declare type RegistryEntry = {
    datakey: string;
    data: string;
    revision: number;
};
export declare type SignedRegistryEntry = {
    entry: RegistryEntry;
    signature: Signature;
};
/**
 * Gets the registry entry corresponding to the publicKey and dataKey.
 * @param publicKey - The user public key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param [customOptions={}] - Additional settings that can optionally be set.
 * @param [customOptions.timeout=5000] - Timeout in ms for the registry lookup.
 */
export declare function getEntry(this: SkynetClient, publicKey: PublicKey, datakey: string, customOptions?: {}): Promise<SignedRegistryEntry | null>;
export declare function setEntry(this: SkynetClient, privateKey: SecretKey, datakey: string, entry: RegistryEntry, customOptions?: {}): Promise<void>;
//# sourceMappingURL=registry.d.ts.map