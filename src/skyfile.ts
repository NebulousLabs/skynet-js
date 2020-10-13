import JSBI from "jsbi";
import "./bigint-buffer";

const { BigInt } = JSBI;

export const cipherTypeLen = 8;

/**
 * The size of the key-data field in a skyfileLayout.
 */
export const layoutKeyDataSize = 64;

/**
 * Describes the amount of space within the first sector of a skyfile used to
 * describe the rest of the skyfile.
 */
const skyfileLayoutSize = 99;

/**
 * Establishes the current version for creating skyfiles. The skyfile versions
 * are different from the siafile versions.
 */
const skyfileVersion = 1;

export class SkyfileLayout {
  version: number;
  filesize: BigInt;
  metadataSize: BigInt;
  fanoutSize: BigInt;
  fanoutDataPieces: number;
  fanoutParityPieces: number;
  cipherType: Uint8Array;
  keyData: Uint8Array;

  encode(): Uint8Array {
    let buffer = new ArrayBuffer(skyfileLayoutSize);
    const b = new DataView(buffer);
    let offset = 0;

    b.setUint8(offset, this.version);
    offset += 1;
    b.setUint64(offset, this.filesize, true);
    offset += 8;
    b.setUint64(offset, this.metadataSize, true);
    offset += 8;
    b.setUint64(offset, this.fanoutSize, true);
    offset += 8;
    b.setUint8(offset, this.fanoutDataPieces);
    offset += 1;
    b.setUint8(offset, this.fanoutParityPieces);
    offset += 1;

    const bytes = new Uint8Array(buffer);
    bytes.set(this.cipherType, offset);
    offset += this.cipherType.length;
    bytes.set(this.keyData, offset);
    offset += this.keyData.length;

    // Sanity check. If this check fails, encode() does not match the
    // SkyfileLayoutSize.
    if (offset != skyfileLayoutSize) {
      throw new Error(`layout size ${skyfileLayoutSize} does not match the amount of data decoded ${offset}`);
    }

    return bytes;
  }
}

/**
 * Loads the layout from a base sector.
 */
export function decode(bytes: Uint8Array): SkyfileLayout {
  // DataView allows us to access mixed-format data from the same buffer.
  const b = new DataView(bytes.buffer);
  let sl = new SkyfileLayout();
  let offset = 0;

  sl.version = b.getUint8(offset);
  offset += 1;
  sl.filesize = b.getUint64(offset, true);
  offset += 8;
  sl.metadataSize = b.getUint64(offset, true);
  offset += 8;
  sl.fanoutSize = b.getUint64(offset, true);
  offset += 8;
  sl.fanoutDataPieces = b.getUint8(offset);
  offset += 1;
  sl.fanoutParityPieces = b.getUint8(offset);
  offset += 1;
  sl.cipherType = new Uint8Array(bytes.buffer, offset, cipherTypeLen);
  offset += sl.cipherType.length;
  sl.keyData = new Uint8Array(bytes.buffer, offset, layoutKeyDataSize);
  offset += sl.keyData.length;

  // Sanity check. If this check fails, decode() does not match the
  // SkyfileLayoutSize.
  if (offset != skyfileLayoutSize) {
    throw new Error(`layout size ${skyfileLayoutSize} does not match the amount of data decoded ${offset}`);
  }

  return sl;
}
