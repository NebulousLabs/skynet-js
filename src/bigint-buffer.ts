// From https://github.com/elk-chat/elk_web/blob/master/packages/sdk/bigint-buffer.ts.

import JSBI from "jsbi";

const { BigInt } = JSBI;

declare global {
  interface DataView {
    setUint64: Function;
    getUint64: Function;
  }
}

DataView.prototype.setUint64 = function setUint64(byteOffset: number, value: typeof BigInt, littleEndian: boolean) {
  if (typeof value === "bigint" && typeof this.setBigUint64 !== "undefined") {
    // the original native implementation for bigint
    this.setBigUint64(byteOffset, value, littleEndian);
  } else if (value.constructor === JSBI && typeof value.sign === "bigint" && typeof this.setBigUint64 !== "undefined") {
    // JSBI wrapping a native bigint
    this.setBigUint64(byteOffset, value.sign, littleEndian);
  } else if (value.constructor === JSBI) {
    // JSBI polyfill implementation
    const lowWord = value[0];
    let highWord = 0;
    if (value.length >= 2) {
      highWord = value[1];
    }
    this.setUint32(byteOffset + (littleEndian ? 0 : 4), lowWord, littleEndian);
    this.setUint32(byteOffset + (littleEndian ? 4 : 0), highWord, littleEndian);
  } else {
    throw TypeError("Value needs to be BigInt ot JSBI");
  }
};
DataView.prototype.getUint64 = function getUint64(byteOffset: number, littleEndian: boolean) {
  if (typeof this.getBigUint64 !== "undefined") {
    return this.getBigUint64(byteOffset, littleEndian);
  }
  let lowWord = 0;
  let highWord = 0;
  lowWord = this.getUint32(byteOffset + (littleEndian ? 0 : 4), littleEndian);
  highWord = this.getUint32(byteOffset + (littleEndian ? 4 : 0), littleEndian);
  const result = new JSBI(2, false);
  result.__setDigit(0, lowWord);
  result.__setDigit(1, highWord);
  return result;
};
