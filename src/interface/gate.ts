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
    protected bridgeConnection: Promise<Connection>,
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
    const bridgeConnection = ParentHandshake(messenger, {}, opts.handshakeMaxAttempts, opts.handshakeAttemptsInterval);

    // Get the bridge metadata.
    const connection = await bridgeConnection;
    const bridgeMetadata = connection.remoteHandle().call("getBridgeMetadata");

    return new Gate(client, skappInfo, bridgeUrl, bridgeMetadata, childFrame, bridgeConnection, opts);
  }

  // ===============
  // Public Gate API
  // ===============

  async loadInterface(schema: InterfaceSchema): Promise<Interface> {
    const loadedInterface = new Interface(this, schema);

    // Add each method in the schema to the exposed interface.
    for (let [name, _schema] of Object.entries(schema.methods)) {
      // Use normal function for non-lexical resolution of 'this'.
      const method = async function (this: Interface, ...args: unknown[]): Promise<unknown> {
        return this.gate.callInterface(this.schema, name, args);
      };

      loadedInterface[name] = method;
    }

    return loadedInterface;
  }

  async callInterface(schema: InterfaceSchema, method: string, ...args: unknown[]): Promise<unknown> {
    // TODO: Add checks for valid parameters and return value. Should be in skynet-provider-utils and should check for reserved names.
    // TODO: This check doesn't work.
    // if (method in this.providerStatus.providerInterface) {
    //   throw new Error(
    //     `Unsupported method for this provider interface. Method: '${method}', Interface: ${this.providerStatus.providerInterface}`
    //   );
    // }

    const connection = await this.bridgeConnection;
    return connection.remoteHandle().call("callInterface", schema, method, args);
  }

  /**
   * Destroys the bridge by: 1. unloading the providers on the bridge, 2. closing the bridge connection, 3. closing the child iframe
   */
  async destroy(): Promise<void> {
    // TODO: For all connected interfaces, send a destroyProvider call.

    // TODO: Delete all connected interfaces.

    // Close the bridge connection.
    const connection = await this.bridgeConnection;
    connection.close();

    // Close the child iframe.
    if (this.childFrame) {
      this.childFrame.parentNode!.removeChild(this.childFrame);
    }
  }

  async logout(schema: InterfaceSchema): Promise<void> {
    const connection = await this.bridgeConnection;
    await connection.remoteHandle().call("logout", schema);
  }

  async loginSilent(schema: InterfaceSchema): Promise<void> {
    const connection = await this.bridgeConnection;
    await connection.remoteHandle().call("loginSilent", schema, this.skappInfo);
  }

  async loginPopup(): Promise<void> {
    // Register an event listener for 'connection'.

    const connection = await this.bridgeConnection;

    const promise: Promise<void> = new Promise((resolve, reject) => {
      const remoteHandle = connection.remoteHandle();
      const handleEvent = (status: boolean) => {
        remoteHandle.removeEventListener("connection", handleEvent);

        if (status) {
          resolve();
        } else {
          reject();
        }
      };

      remoteHandle.addEventListener("connection", handleEvent);
    });

    // Launch router

    const result = await this.launchRouter();
    if (result === "closed") {
      // User closed the router or connector.
      throw new Error("Router window closed");
    } else if (result !== "success") {
      throw new Error(result);
    }

    // Wait for a one-time 'connection' event.

    return promise;
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
  protected async launchRouter(): Promise<string> {
    // Set the router URL.
    const bridgeMetadata = await this.bridgeMetadata;
    const routerUrl = urljoin(this.bridgeUrl, bridgeMetadata.relativeRouterUrl);

    // Wait for result.
    const promise: Promise<string> = new Promise((resolve, reject) => {
      // Register a message listener.
      const handleMessage = (event: MessageEvent) => {
        console.log(event);
        if (event.origin !== this.bridgeUrl) return;

        window.removeEventListener("message", handleMessage);

        // Resolve or reject the promise.
        if (!event.data) {
          reject("Router did not send response");
        }
        resolve(event.data);
      };

      window.addEventListener("message", handleMessage);
    });

    // Open the router.
    const routerWindow = popupCenter(
      routerUrl,
      bridgeMetadata.routerName,
      bridgeMetadata.routerW,
      bridgeMetadata.routerH
    );

    return promise;
  }
}
