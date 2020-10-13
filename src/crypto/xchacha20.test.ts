import { areEqualUint8Arrays, fillRandUint8Array } from "../utils";
import { XChaCha20CipherKey } from "./xchacha20";

describe("XChaCha20Encryption", () => {
  const key = new XChaCha20CipherKey();

  it("encrypts and decrypts a zero plaintext, and compares the decrypted to the original", async () => {
    const plaintext = new Uint8Array(600);
    const ciphertext = await key.encryptBytes(plaintext);
    const decryptedPlaintext = await key.decryptBytes(ciphertext);

    expect(areEqualUint8Arrays(plaintext, decryptedPlaintext));
  });

  it("encrypts and decrypts a nonzero plaintext", async () => {
    const plaintext = new Uint8Array(600);
    fillRandUint8Array(plaintext);
    const ciphertext = await key.encryptBytes(plaintext);

    // Multiple encryptions should return the same ciphertext.
    for (let i = 0; i < 3; i++) {
      const newCiphertext = await key.encryptBytes(plaintext);
      expect(areEqualUint8Arrays(ciphertext, newCiphertext));
    }

    // Multiple decryptions should return the same plaintext.
    for (let i = 0; i < 3; i++) {
      const decryptedPlaintext = await key.decryptBytes(ciphertext);
      expect(areEqualUint8Arrays(plaintext, decryptedPlaintext));
    }
  });
});
