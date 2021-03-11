export { Tunnel } from "./tunnel";
export type { CustomTunnelOptions } from "./tunnel";

import { InterfaceSchema, ProviderInfo } from "skynet-interface-utils";

import { Tunnel } from "./tunnel";

export type CustomConnectOptions = {
  defaultProviders?: Array<ProviderInfo>;
};

const defaultConnectOptions = {
  defaultProviders: [],
};

class BaseInterfaceInstance {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(tunnel: Tunnel, schema: InterfaceSchema) {
    addMethods(this, tunnel, schema);
  }
}

export class InterfaceInstance extends BaseInterfaceInstance {

  constructor(tunnel: Tunnel, schema: InterfaceSchema) {
    super(tunnel, schema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the tunnel, and we can't have one in the
    // class because of the index signature.)
    this.connectPopup = async (customOptions: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      await tunnel.connectPopup(schema.name, opts);
    }
    this.connectSilent = async () => tunnel.connectSilent(schema.name);
    this.disconnect = async () => tunnel.disconnect(schema.name);
  }
}

export class MySkyInstance extends BaseInterfaceInstance {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(tunnel: Tunnel, schema: InterfaceSchema) {
    super(tunnel, schema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the tunnel, and we can't have one in the
    // class because of the index signature.)
    this.loginPopup = async (customOptions: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      await tunnel.loginPopup(schema.name, opts);
    }
    this.loginSilent = async () => tunnel.loginSilent(schema.name);
    this.logout = async () => tunnel.logout(schema.name);
  }
}

function addMethods(instance: BaseInterfaceInstance, tunnel: Tunnel, schema: InterfaceSchema) {
  // Add each method in the schema to the exposed interface.
  for (let [name, _schema] of Object.entries(schema.methods)) {
    // Use arrow function for lexical resolution of 'this'.
    const method = async (...args: unknown[]): Promise<unknown> => {
      return tunnel.callInterface(schema.name, name, schema, args);
    };

    instance[name] = method;
  }
}
