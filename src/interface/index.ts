export { Gate } from "./gate";
export type { CustomGateOptions } from "./gate";

import { InterfaceSchema } from "skynet-interface-utils";

import { Gate } from "./gate";

export class Interface {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function | unknown;

  constructor(protected gate: Gate, protected schema: InterfaceSchema) {}

  loginPopup = this.gate.loginPopup;
  loginSilent = async () => this.gate.loginSilent(this.schema);
  logout = async () => this.gate.logout(this.schema);
}
