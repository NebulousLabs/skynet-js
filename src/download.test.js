import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { SkynetClient, defaultSkynetPortalUrl } from "./index";

const mock = new MockAdapter(axios);

const portalUrl = defaultSkynetPortalUrl;
const hnsLink = "doesn";
const client = new SkynetClient(portalUrl);
const skylink = "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg";
const validSkylinkVariations = [
  skylink,
  `sia:${skylink}`,
  `sia://${skylink}`,
  `${portalUrl}/${skylink}`,
  `${portalUrl}/${skylink}/foo/bar`,
  `${portalUrl}/${skylink}?foo=bar`,
];
const validHnsLinkVariations = [hnsLink, `hns:${hnsLink}`, `hns://${hnsLink}`];

describe("download", () => {
  it("should call window.open with a download url with attachment set", () => {
    const windowOpen = jest.spyOn(window, "open").mockImplementation();

    validSkylinkVariations.forEach((input) => {
      windowOpen.mockReset();

      client.download(input);

      expect(windowOpen).toHaveBeenCalledTimes(1);
      expect(windowOpen).toHaveBeenCalledWith(`${portalUrl}/${skylink}?attachment=true`, "_blank");
    });
  });
});

describe("getDownloadUrl", () => {
  it("should return correctly formed download URL", () => {
    validSkylinkVariations.forEach((input) => {
      expect(client.getDownloadUrl(input)).toEqual(`${portalUrl}/${skylink}`);
    });
  });

  it("should return correctly formed url with forced download", () => {
    const url = client.getDownloadUrl(skylink, { download: true });

    expect(url).toEqual(`${portalUrl}/${skylink}?attachment=true`);
  });
});

describe("open", () => {
  it("should call window.open with a download url", () => {
    const windowOpen = jest.spyOn(window, "open").mockImplementation();

    validSkylinkVariations.forEach((input) => {
      windowOpen.mockReset();

      client.open(input);

      expect(windowOpen).toHaveBeenCalledTimes(1);
      expect(windowOpen).toHaveBeenCalledWith(`${portalUrl}/${skylink}`, "_blank");
    });
  });
});

describe("openHns", () => {
  const hnsUrl = `${portalUrl}/hns/${hnsLink}`;

  beforeEach(() => {
    mock.onGet(hnsUrl).reply(200, { skylink: skylink });
  });

  it("should call axios.get with the portal and hns link", async () => {
    const windowOpen = jest.spyOn(window, "open").mockImplementation();

    let i = 1;
    for (const input of validHnsLinkVariations) {
      await client.openHns(input);

      expect(mock.history.get.length).toBe(i);

      expect(windowOpen).toHaveBeenCalledTimes(i);
      expect(windowOpen).toHaveBeenCalledWith(`${portalUrl}/${skylink}`, "_blank");

      i++;
    }

    mock.resetHistory();
  });
});
