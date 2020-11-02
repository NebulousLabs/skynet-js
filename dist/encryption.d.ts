import { SkynetClient } from "./client";
export declare function addSkykey(this: SkynetClient, skykey: string, customOptions?: {}): Promise<void>;
export declare function createSkykey(this: SkynetClient, skykeyName: string, skykeyType: string, customOptions?: {}): Promise<void>;
export declare function getSkykeyById(this: SkynetClient, skykeyId: string, customOptions?: {}): Promise<void>;
export declare function getSkykeyByName(this: SkynetClient, skykeyName: string, customOptions?: {}): Promise<void>;
export declare function getSkykeys(this: SkynetClient, customOptions?: {}): Promise<void>;
//# sourceMappingURL=encryption.d.ts.map