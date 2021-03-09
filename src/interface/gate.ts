import { ParentHandshake, WindowMessenger } from "post-me";
import type { Connection } from "post-me";
import { createIframe, ensureUrl } from "skynet-interface-utils";
import type { BridgeMetadata, InterfaceSchema, SkappInfo } from "skynet-interface-utils";
import urljoin from "url-join";

import { Interface } from ".";
import { SkynetClient } from "../client";
import { popupCenter } from "./utils";

export type CustomGateOptions = {
  handshakeMaxAttempts: number;
  handshakeAttemptsInterval: number;
};

const defaultBridgeOptions = {
  handshakeMaxAttempts: 20,
  handshakeAttemptsInterval: 500,
};

export class Gate {
  // ===========
  // Constructor
  // ===========

  constructor(
    protected client: SkynetClient,
    public skappInfo: SkappInfo,
    public bridgeUrl: string,
    public bridgeMetadata: Promise<BridgeMetadata>,
    protected childFrame: HTMLIFrameElement,
    protected bridgeConnection: Connection,
    public options: CustomGateOptions
  ) {}

  static async initialize(
    client: SkynetClient,
    skappInfo: SkappInfo,
    bridgeUrl: string,
    customOptions?: CustomGateOptions
  ): Promise<Gate> {
    if (typeof Storage == "undefined") {
      throw new Error("Browser does not support web storage");
    }

    const opts = { ...defaultBridgeOptions, ...customOptions };

    // Initialize state.
    bridgeUrl = ensureUrl(bridgeUrl);

    // Create the iframe.
    const childFrame = createIframe(bridgeUrl, bridgeUrl);
    const childWindow = childFrame.contentWindow!;

    // Connect to the iframe.
    const messenger = new WindowMessenger({
      localWindow: window,
      remoteWindow: childWindow,
      remoteOrigin: "*",
    });
    const connection = await ParentHandshake(messenger, {}, opts.handshakeMaxAttempts, opts.handshakeAttemptsInterval);

    // Get the bridge metadata.
    const bridgeMetadata = connection.remoteHandle().call("getBridgeMetadata", skappInfo);

    return new Gate(client, skappInfo, bridgeUrl, bridgeMetadata, childFrame, connection, opts);
  }

  // ===============
  // Public Gate API
  // ===============

  async loadInterface(schema: InterfaceSchema): Promise<Interface> {
    const loadedInterface = new Interface(this, schema);

    // Add each method in the schema to the exposed interface.
    for (let [name, _schema] of Object.entries(schema.methods)) {
      // Use arrow function for lexical resolution of 'this'.
      const method = async (...args: unknown[]): Promise<unknown> => {
        return this.callInterface(schema.name, name, args);
      };

      loadedInterface[name] = method;
    }

    return loadedInterface;
  }

  async callInterface(interfaceName: string, method: string, ...args: unknown[]): Promise<unknown> {
    // TODO: Add checks for valid parameters and return value. Should be in skynet-provider-utils and should check for reserved names.
    // TODO: This check doesn't work.
    // if (method in this.providerStatus.providerInterface) {
    //   throw new Error(
    //     `Unsupported method for this provider interface. Method: '${method}', Interface: ${this.providerStatus.providerInterface}`
    //   );
    // }

    return this.bridgeConnection.remoteHandle().call("callInterface", interfaceName, method, args);
  }

  /**
   * Destroys the bridge by: 1. unloading the providers on the bridge, 2. closing the bridge connection, 3. closing the child iframe
   */
  async destroy(): Promise<void> {
    // TODO: For all connected interfaces, send a destroyProvider call.

    // TODO: Delete all connected interfaces.

    // Close the bridge connection.
    this.bridgeConnection.close();

    // Close the child iframe.
    if (this.childFrame) {
      this.childFrame.parentNode!.removeChild(this.childFrame);
    }
  }

  async logout(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("logout", interfaceName);
  }

  async loginSilent(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("loginSilent", interfaceName);
  }

  async loginPopup(interfaceName: string): Promise<void> {
    // Launch router

    this.launchRouter();

    // Wait for bridge to complete the connection.

    return this.bridgeConnection.remoteHandle().call("loginPopup", interfaceName);
  }

  /**
   * Restarts the bridge by destroying it and starting it again.
   */
  async restart(): Promise<Gate> {
    await this.destroy();
    return Gate.initialize(this.client, this.skappInfo, this.bridgeUrl, this.options);
  }

  // =====================
  // Internal Gate Methods
  // =====================

  // TODO: should check periodically if window is still open.
  /**
   * Creates window with router and waits for a response.
   */
  protected async launchRouter(): Promise<void> {
    // Set the router URL.
    const bridgeMetadata = await this.bridgeMetadata;
    let routerUrl = urljoin(this.bridgeUrl, bridgeMetadata.relativeRouterUrl);
    routerUrl = `${routerUrl}?skappName=${this.skappInfo.name}&skappDomain=${this.skappInfo.domain}`;

    // Open the router.
    popupCenter(routerUrl, bridgeMetadata.routerName, bridgeMetadata.routerW, bridgeMetadata.routerH);
  }
}
