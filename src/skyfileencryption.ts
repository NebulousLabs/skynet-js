import { Skykey, skykeyIDLen } from "./skykey/skykey";
import { skykeyManager, errNoSkykeysWithThatID } from "./skykey/manager";
import { decode, SkyfileLayout } from "./skyfile";
import { sectorSize } from "./constants";
import { xNonceSize } from "./crypto/xchacha20";
import { typeXChaCha20 } from "./crypto/crypto";
import * as types from "./types";
import { areEqualUint8Arrays } from "./utils";
import JSBI from "jsbi";

/**
 * baseSectorNonceDerivation is the specifier used to derive a nonce for base
 * sector encryption
 */
const baseSectorNonceDerivation = types.newSpecifier("BaseSectorNonce");

const errNoSkykeyMatchesSkyfileEncryptionID = "Unable to find matching skykey for public ID encryption";

const skyfileEncryptedHeaderSize = 2048;

const skyfileEncryptedPaddingGrowthThreshold = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(20)); // 1 MiB

export function decryptFile(file: File): File {
  const fileContents = file.arrayBuffer();
}

export function encryptFile(file: File, skykey: Skykey): File {
  const fileSpecificSubkey = skykey.generateFileSpecificSubkey();

  const fileContents = file.arrayBuffer();
}

export function encryptionEnabled(opts: any): boolean {
  return (opts.skykeyName != "" || opts.skykeyID != "");
}

function padFileForEncryption() {
}

export function padFilesize(size: typeof JSBI.BigInt): typeof JSBI.BigInt {
  let i = JSBI.BigInt(skyfileEncryptedHeaderSize); // Minimum size for an encrypted file.

  for (; JSBI.lessThan(i, skyfileEncryptedPaddingGrowthThreshold); i = JSBI.multiply(i, JSBI.BigInt(2))) {
    if (JSBI.lessThanOrEqual(size, i)) {
      return i;
    }
  }

  for (;; i = JSBI.add(i, JSBI.divide(i, JSBI.BigInt(4)))) {
    if (JSBI.lessThanOrEqual(size, i)) {
      return i;
    }
  }
}

/**
 * NOTE: Below functions are not currently used.
 */

/**
 * checkSkyfileEncryptionIDMatch tries to find a Skykey that can decrypt the
 * identifier and be used for decrypting the associated skyfile.
 */
async function checkSkyfileEncryptionIDMatch(encryptionIdentifier: Uint8Array, nonce: Uint8Array): Promise<Skykey> {
  const allSkykeys = skykeyManager.skykeys();
  for (let skykey of allSkykeys) {
    let matches = false;
    try {
      matches = await skykey.matchesSkyfileEncryptionID(encryptionIdentifier, nonce);
    } catch (error) {
      continue;
    }
    if (matches) {
      return skykey;
    }
  }
  throw new Error(errNoSkykeyMatchesSkyfileEncryptionID);
}

/**
 * Attempts to decrypt the baseSector. If it has the necessary Skykey, it will
 * decrypt the baseSector in-place. It returns the file-specific skykey to be
 * used for decrypting the rest of the associated skyfile.
 */
async function decryptBaseSector(baseSector: Uint8Array) {
  // Sanity check - baseSector should not be more than modules.SectorSize.
  // Note that the base sector may be smaller in the event of a packed
  // skyfile.
  if (baseSector.length > sectorSize) {
    throw new Error("decryptBaseSector given a baseSector that is too large");
  }
  let skyfileLayout = decode(baseSector);

  if (!isEncryptedLayout(skyfileLayout)) {
    throw new Error("Expected layout to be marked as encrypted!");
  }

  // Get the nonce to be used for getting private-id skykeys, and for deriving the
  // file-specific skykey.
  const nonce = new Uint8Array(skyfileLayout.keyData, skykeyIDLen, xNonceSize);

  // Grab the key ID from the layout.
  const keyID = new Uint8Array(skyfileLayout.keyData, 0, skykeyIDLen);

  let masterSkykey;
  try {
    // Try to get the skykey associated with that ID.
    masterSkykey = skykeyManager.keyByID(keyID);
  } catch (error) {
    // If the ID is unknown, use the key ID as an encryption identifier and try
    // finding the associated skykey.
    if (error.message.contains(errNoSkykeysWithThatID)) {
      masterSkykey = await checkSkyfileEncryptionIDMatch(keyID, nonce);
    } else {
      throw new Error(`${error.message}; "Unable to find associated skykey"`);
    }
  }

  // Derive the file-specific key.
  const fileSkykey = masterSkykey.subkeyWithNonce(nonce);

  // Derive the base sector subkey and use it to decrypt the base sector.
  const baseSectorKey = fileSkykey.deriveSubkey(baseSectorNonceDerivation);

  // Get the cipherkey.
  const cipherKey = baseSectorKey.cipherKey();

  await cipherKey.decryptBytesInPlace(baseSector, 0);

  // Save the visible-by-default fields of the baseSector's layout.
  const version = skyfileLayout.version;
  const cipherType = skyfileLayout.cipherType;
  const keyData = new Uint8Array(skyfileLayout.keyData); // Copy the key data.

  // Decode the now decrypted layout.
  skyfileLayout = decode(baseSector);

  // Reset the visible-by-default fields.
  // (They were turned into random values by the decryption)
  skyfileLayout.version = version;
  skyfileLayout.cipherType = cipherType;
  skyfileLayout.keyData = new Uint8Array(keyData);

  // Now re-copy the decrypted layout into the decrypted baseSector.
  baseSector.set(skyfileLayout.encode(), 0);

  return fileSkykey;
}

/**
 * isEncryptedBaseSector returns true if and only if the the baseSector is
 * encrypted.
 */
function isEncryptedBaseSector(baseSector: Uint8Array): boolean {
  const skyfileLayout = decode(baseSector);
  return isEncryptedLayout(skyfileLayout);
}

/**
 * isEncryptedLayout returns true if and only if the the layout indicates that
 * it is from an encrypted base sector.
 */
function isEncryptedLayout(skyfileLayout: SkyfileLayout): boolean {
  return skyfileLayout.version == 1 && areEqualUint8Arrays(skyfileLayout.cipherType, typeXChaCha20);
}
