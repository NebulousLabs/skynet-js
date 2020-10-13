import { ciphertext } from "./crypto";

export class PlainTextCipherKey {
  key(): Uint8Array {
    return new Uint8Array();
  }

  async decryptBytes(ct: ciphertext): Promise<Uint8Array> {
    return new Uint8Array(ct);
  }
}
