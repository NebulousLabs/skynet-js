import { Schema } from "skynet-interface-utils";
import { CustomConnectOptions, defaultConnectOptions } from ".";
import { Tunnel } from "./tunnel";

export class BaseDacInstance {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(tunnel: Tunnel, schema: Schema) {
    addMethods(this, tunnel, schema);
  }
}

export class DacInstance extends BaseDacInstance {
  constructor(tunnel: Tunnel, schema: Schema) {
    super(tunnel, schema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the tunnel, and we can't have one in the
    // class because of the index signature.)
    this.connectPopup = async (customOptions: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      await tunnel.connectPopup(schema.name, opts);
    };
    this.connectSilent = async () => tunnel.connectSilent(schema.name);
    this.disconnect = async () => tunnel.disconnect(schema.name);
  }
}

function addMethods(instance: BaseDacInstance, tunnel: Tunnel, schema: Schema) {
  // Add each method in the schema to the exposed interface.
  for (let [name, _schema] of Object.entries(schema.methods)) {
    const method = async (...args: unknown[]): Promise<unknown> => {
      return tunnel.call(schema.name, name, schema, ...args);
    };

    instance[name] = method;
  }
}
