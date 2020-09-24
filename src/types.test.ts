import { newSpecifier } from "./types";
import { areEqualUint8Arrays } from "./utils";

describe("newSpecifier", () => {
  it("should return correct specifiers for given strings", () => {
    const specifier = "testing";
    const expected = new Uint8Array([116, 101, 115, 116, 105, 110, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(areEqualUint8Arrays(newSpecifier(specifier), expected));
  });
});
