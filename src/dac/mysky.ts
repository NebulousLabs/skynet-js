import { Schema } from "skynet-interface-utils";

import { CustomConnectOptions, defaultConnectOptions } from ".";
import { BaseDacInstance } from "./instance";
import { Tunnel } from "./tunnel";

// TODO: Add default providers.
export const mySkySchema: Schema = {
  name: "MySky",
  version: "0.0.1",
  mysky: true,
  methods: {
    identity: {
      parameters: [],
      returnType: "string",
    },
    getJSON: {
      parameters: [
        {
          name: "dataKey",
          type: "string",
        },
        {
          name: "customOptions",
          type: "object",
          optional: true,
        },
      ],
      returnType: "object",
    },
  },
};

export class MySkyInstance extends BaseDacInstance {
  // Interfaces may have functions assigned to arbitrary properties.
  [index: string]: Function;

  constructor(tunnel: Tunnel) {
    super(tunnel, mySkySchema);

    // Add these methods dynamically at runtime (we can't do it at compile-time
    // because we need a reference to the tunnel, and we can't have a tunnel
    // reference on the class because of the index signature.)
    this.loginPopup = async (customOptions?: CustomConnectOptions) => {
      const opts = { ...defaultConnectOptions, ...customOptions };

      console.log(opts.providers);
      await tunnel.loginPopup(mySkySchema.name, opts);
    };
    this.loginSilent = async () => tunnel.loginSilent(mySkySchema.name);
    this.logout = async () => tunnel.logout(mySkySchema.name);
  }
}
