export type { DacInstance } from "./instance";
export type { MySkyInstance } from "./mysky";
export { mySkySchema } from "./mysky";
export { defaultBridgeUrl, Tunnel } from "./tunnel";
export type { CustomTunnelOptions } from "./tunnel";

import { ProviderInfo } from "skynet-interface-utils";

export type CustomConnectOptions = {
  providers?: Array<ProviderInfo>;
};

export const defaultConnectOptions = {
  providers: [],
};
