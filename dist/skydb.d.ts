import { SkynetClient } from "./client";
import { PublicKey, SecretKey } from "./crypto";
/**
 * Gets the JSON object corresponding to the publicKey and dataKey.
 * @param publicKey - The user public key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param [customOptions={}] - Additional settings that can optionally be set.
 * @param [customOptions.timeout=5000] - Timeout in ms for the registry lookup.
 */
export declare function getJSON(this: SkynetClient, publicKey: PublicKey, dataKey: string, customOptions?: {}): Promise<{
    data: Record<string, unknown>;
    revision: number;
} | null>;
export declare function setJSON(this: SkynetClient, privateKey: SecretKey, dataKey: string, json: Record<string, unknown>, revision?: number, customOptions?: {}): Promise<void>;
//# sourceMappingURL=skydb.d.ts.map