export { Gate } from "./gate";
export type { CustomGateOptions } from "./gate";

import { InterfaceSchema, ProviderInfo } from "skynet-interface-utils";

import { Gate } from "./gate";

export type CustomConnectOptions = {
  defaultProviders?: Array<ProviderInfo>;
};

const defaultConnectOptions = {
  defaultProviders: [],
};

class BaseInterface {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(gate: Gate, schema: InterfaceSchema) {
    addMethods(this, gate, schema);
  }
}

export class Interface extends BaseInterface{

  constructor(gate: Gate, schema: InterfaceSchema) {
    super(gate, schema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the gate, and we can't have one in the
    // class because of the index signature.)
    this.connectPopup = async (customOptions: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      gate.connectPopup(schema.name, opts);
    }
    this.connectSilent = async () => gate.connectSilent(schema.name);
    this.disconnect = async () => gate.disconnect(schema.name);
  }
}

export class MySky extends BaseInterface {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(gate: Gate, schema: InterfaceSchema) {
    super(gate, schema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the gate, and we can't have one in the
    // class because of the index signature.)
    this.loginPopup = async (customOptions: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      gate.loginPopup(schema.name, opts);
    }
    this.loginSilent = async () => gate.loginSilent(schema.name);
    this.logout = async () => gate.logout(schema.name);
  }
}

function addMethods(inter: BaseInterface, gate: Gate, schema: InterfaceSchema) {
  // Add each method in the schema to the exposed interface.
  for (let [name, _schema] of Object.entries(schema.methods)) {
    // Use arrow function for lexical resolution of 'this'.
    const method = async (...args: unknown[]): Promise<unknown> => {
      return gate.callInterface(schema.name, name, schema, args);
    };

    inter[name] = method;
  }
}
