export { Gate } from "./gate";
export type { CustomGateOptions } from "./gate";

import { InterfaceSchema } from "skynet-interface-utils";

import { Gate } from "./gate";

export class Interface {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(gate: Gate, schema: InterfaceSchema) {
    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the gate, and we can't have one in the
    // class because of the index signature.)
    this.loginPopup = async () => gate.loginPopup(schema.name);
    this.loginSilent = async () => gate.loginSilent(schema.name);
    this.logout = async () => gate.logout(schema.name);
  }
}
