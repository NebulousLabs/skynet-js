import { typePublicID } from "./skykey";
import { SkykeyManager } from "./manager";
import { areEqualUint8Arrays, asciiToUint8Array } from "../utils";

describe("deriveSubkey", () => {
  it("should create and derive keys that match skykeys in Sia", async () => {
    const sm = new SkykeyManager();
    const skykey = sm.createKey("derivation_test_key", typePublicID);

    const derivationPath1 = asciiToUint8Array("derivationtest1");
    // TODO: Copy test from TestSkykeyDerivations.
    const expected = new Uint8Array([81, 185, 66, 46, 118, 187, 31, 212, 249, 114, 183, 69, 97, 167, 187, 55, 12, 235, 254, 239, 25, 208, 243, 74, 224, 236, 51, 206, 158, 225, 92, 143, 79, 154, 230, 26, 135, 117, 120, 208, 181, 98, 48, 116, 193, 73, 152, 50, 141, 105, 128, 5, 7, 34, 31, 38]);
    expect(areEqualUint8Arrays(skykey.entropy, expected));

    expect(skykey.name).toBe("derivation_test_key");
    expect(skykey.keyType).toBe(1);

    const dk1 = skykey.deriveSubkey(derivationPath1);
    // prettier-ignore

    expect(dk1.name).toBe("derivation_test_key");
    expect(dk1.keyType).toBe(1);
    expect(areEqualUint8Arrays(dk1.entropy, expected));
  });
});
