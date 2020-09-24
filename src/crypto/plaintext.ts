import { ciphertext } from "./crypto";

export class PlainTextCipherKey {
  key(): Uint8Array {
    return new Uint8Array();
  }

  decryptBytes(ct: ciphertext): Uint8Array {
    return new Uint8Array(ct);
  }
}
