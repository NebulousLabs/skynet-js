import { SkynetClient, defaultSkynetPortalUrl, genKeyPairAndSeed } from "./index";
import { hashDataKey } from "./crypto";

const portalUrl = defaultSkynetPortalUrl;
const client = new SkynetClient(portalUrl);
const { publicKey } = genKeyPairAndSeed();
const dataKey = "app";

describe("getEntryUrl", () => {
  it("should generate the correct registry url for the given entry", () => {
    const url = client.registry.getEntryUrl(publicKey, dataKey);
    const encodedPK = encodeURIComponent(`ed25519:${publicKey}`);
    const encodedDK = encodeURIComponent(Buffer.from(hashDataKey(dataKey)).toString("hex"));

    expect(url).toEqual(`${portalUrl}/skynet/registry?publickey=${encodedPK}&datakey=${encodedDK}`);
  });
});
