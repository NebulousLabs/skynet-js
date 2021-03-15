import { ParentHandshake, WindowMessenger } from "post-me";
import type { Connection } from "post-me";
import { createIframe, defaultHandshakeAttemptsInterval, defaultHandshakeMaxAttempts, ensureUrl, ProviderInfo } from "skynet-interface-utils";
import type { BridgeMetadata, InterfaceSchema, SkappInfo } from "skynet-interface-utils";
import urljoin from "url-join";

import { CustomConnectOptions, InterfaceInstance, MySkyInstance } from ".";
import { SkynetClient } from "../client";
import { popupCenter } from "./utils";

export type CustomTunnelOptions = {
  handshakeMaxAttempts?: number;
  handshakeAttemptsInterval?: number;
};

const defaultBridgeOptions = {
  handshakeMaxAttempts: defaultHandshakeMaxAttempts,
  handshakeAttemptsInterval: defaultHandshakeAttemptsInterval,
};

export class Tunnel {
  // ===========
  // Constructor
  // ===========

  constructor(
    protected client: SkynetClient,
    public skappInfo: SkappInfo,
    public bridgeUrl: string,
    public bridgeMetadata: BridgeMetadata,
    protected childFrame: HTMLIFrameElement,
    protected bridgeConnection: Connection,
    public options: CustomTunnelOptions
  ) {}

  static async initialize(
    client: SkynetClient,
    skappInfo: SkappInfo,
    bridgeUrl: string,
    customOptions?: CustomTunnelOptions
  ): Promise<Tunnel> {
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
    const bridgeMetadata = await connection.remoteHandle().call("getBridgeMetadata", skappInfo);

    return new Tunnel(client, skappInfo, bridgeUrl, bridgeMetadata, childFrame, connection, opts);
  }

  // ===============
  // Public Tunnel API
  // ===============

  async loadInterface(schema: InterfaceSchema): Promise<InterfaceInstance> {
    const loadedInterface = new InterfaceInstance(this, schema);
    return loadedInterface;
  }

  async loadMySky(schema: InterfaceSchema): Promise<MySkyInstance> {
    if (!schema.mysky) {
      throw new Error("Given schema is not a mysky schema");
    }

    const loadedMySky = new MySkyInstance(this, schema);
    return loadedMySky;
  }

  async callInterface(
    interfaceName: string,
    method: string,
    schema: InterfaceSchema,
    ...args: unknown[]
  ): Promise<unknown> {
    // TODO: Add checks for valid parameters and return value. Should be in skynet-provider-utils and should check for reserved names.

    return this.bridgeConnection.remoteHandle().call("callInterface", interfaceName, method, args);
  }

  async connectPopup(interfaceName: string, opts: CustomConnectOptions): Promise<void> {
    // Launch router

    this.launchRouter(opts.defaultProviders);

    // Wait for bridge to complete the connection.

    return this.bridgeConnection.remoteHandle().call("connectPopup", interfaceName, opts);
  }

  async connectSilent(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("connectSilent", interfaceName);
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

  async disconnect(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("disconnect", interfaceName);
  }

  async logout(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("logout", interfaceName);
  }

  async loginPopup(interfaceName: string, opts: CustomConnectOptions): Promise<void> {
    // Launch router

    const routerWindow = await this.launchRouter(opts.defaultProviders);

    // Wait for bridge to complete the connection.

    return this.bridgeConnection
      .remoteHandle()
      .call("loginPopup", interfaceName, opts)
      .catch((err) => {
        routerWindow.close()
        throw err;
      });
  }

  async loginSilent(interfaceName: string): Promise<void> {
    await this.bridgeConnection.remoteHandle().call("loginSilent", interfaceName);
  }

  /**
   * Restarts the bridge by destroying it and starting it again.
   */
  async restart(): Promise<Tunnel> {
    await this.destroy();
    return Tunnel.initialize(this.client, this.skappInfo, this.bridgeUrl, this.options);
  }

  // =======================
  // Internal Tunnel Methods
  // =======================

  // TODO: should check periodically if window is still open.
  /**
   * Creates window with router and waits for a response.
   */
  protected async launchRouter(providers: Array<ProviderInfo> | undefined): Promise<Window> {
    if (!providers) {
      providers = [];
    }
    const providersString = JSON.stringify(providers);

    // Set the router URL.
    const bridgeMetadata = this.bridgeMetadata;
    let routerUrl = urljoin(this.bridgeUrl, bridgeMetadata.relativeRouterUrl);
    routerUrl = `${routerUrl}?skappName=${this.skappInfo.name}&skappDomain=${this.skappInfo.domain}&providers=${providersString}`;

    // Open the router.
    return popupCenter(routerUrl, bridgeMetadata.routerName, bridgeMetadata.routerW, bridgeMetadata.routerH);
  }
}
