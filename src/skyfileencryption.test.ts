import JSBI from "jsbi";
import { skyfileEncryptedHeaderSize, decryptFile, encryptFile, padFilesize } from "./skyfileencryption";
import { skykeyManager } from "./skykey/manager";

describe("encryptAndDecrypt", () => {
  const skykeyPublic = skykeyManager.keyByName("key_to_the_castle");
  const skykeyPrivate = skykeyManager.keyByName("key_to_the_castle");
  const filename = "bar.txt";
  const file = new File(["foo"], filename, {
    type: "text/plain",
  });
  const encryptedFilePublic = encryptFile(file, skykeyPublic);
  const encryptedFilePrivate = encryptFile(file, skykeyPrivate);

  it("the encrypted files should have obfuscated file size and filename", () => {
    expect (encryptedFilePublic.size).toEqual(skyfileEncryptedHeaderSize);
    expect(encryptedFilePrivate.size).toEqual(skyfileEncryptedHeaderSize);
    expect (encryptedFilePublic.name).toEqual(skyfileEncryptedHeaderSize);
    expect(encryptedFilePrivate.name).toEqual(skyfileEncryptedHeaderSize);
  });

  it("files encrypted with private skykeys should not expose the skykey", () => {

  });

  it("decrypting the encrypted files should get back the original files", () => {
    const decryptedFilePublic = decryptFile(encryptedFilePublic);

    expect(decryptedFilePublic === file);

    const decryptedFilePrivate = decryptFile(encryptedFilePrivate);

    expect(decryptedFilePrivate === file);
  });
});

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
