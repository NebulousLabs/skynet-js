import { SkyfileLayout, decode, cipherTypeLen, layoutKeyDataSize } from "./skyfile";
import JSBI from "jsbi";

const { BigInt } = JSBI;

describe("skyfileLayoutEncoding", () => {
  it("should encode a skyfileLayout and decode to the original object", () => {
    const sl = new SkyfileLayout();
    sl.version = 4;
    sl.filesize = BigInt(5);
    sl.metadataSize = BigInt(6);
    sl.fanoutSize =BigInt(7);
    sl.fanoutDataPieces = 8;
    sl.fanoutParityPieces = 9;
    let buf = new ArrayBuffer(cipherTypeLen);
    sl.cipherType = new Uint8Array(buf);
    buf = new ArrayBuffer(layoutKeyDataSize);
    sl.keyData = new Uint8Array(buf);

    const encoded = sl.encode();
    const sl2 = decode(encoded);

    expect(sl === sl2);
  });
});
