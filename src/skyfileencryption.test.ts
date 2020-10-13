import JSBI from "jsbi";
import { padFilesize } from "./skyfileencryption";

describe("padFileSize", () => {
  const expectedOutputs = [
    [JSBI.BigInt(1), JSBI.BigInt(2048)],
    [JSBI.BigInt(2048), JSBI.BigInt(2048)],
    [JSBI.BigInt(2049), JSBI.BigInt(4096)],
    [JSBI.BigInt(1 << 20), JSBI.BigInt(1 << 20)],
    [JSBI.BigInt((1<< 20)+1), JSBI.BigInt((1<<20)*1.25)],
  ];

  it("should pad given sizes to the correct amount", () => {
    expectedOutputs.forEach(([input, output]) => {
      const actualOutput = padFilesize(input);
      expect(actualOutput).toEqual(output);
    });
  });
});
