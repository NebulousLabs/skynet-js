export { Gate } from "./gate";
export type { CustomGateOptions } from "./gate";

import { InterfaceSchema } from "skynet-interface-utils";

import { Gate } from "./gate";

export class Interface {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  // @ts-expect-error We need the 'gate' and 'schema' properties even though index signatures expect Functions.
  constructor(protected gate: Gate, protected schema: InterfaceSchema) {}

  loginPopup = async () => this.gate.loginPopup(this.schema.name);
  loginSilent = async () => this.gate.loginSilent(this.schema.name);
  logout = async () => this.gate.logout(this.schema.name);
}
