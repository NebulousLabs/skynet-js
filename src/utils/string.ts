/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @returns - The processed string.
 */
export function trimForwardSlash(str: string): string {
  return trimPrefix(trimSuffix(str, "/"), "/");
}

/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
export function trimPrefix(str: string, prefix: string): string {
  while (str.startsWith(prefix)) {
    str = str.slice(prefix.length);
  }
  return str;
}

/**
 * Removes a suffix from the end of the string.
 *
 * @param str - The string to process.
 * @param suffix - The suffix to remove.
 * @returns - The processed string.
 */
export function trimSuffix(str: string, suffix: string): string {
  while (str.endsWith(suffix)) {
    str = str.substring(0, str.length - suffix.length);
  }
  return str;
}

/**
 * Removes a URI prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
export function trimUriPrefix(str: string, prefix: string): string {
  const longPrefix = `${prefix}//`;
  if (str.startsWith(longPrefix)) {
    // longPrefix is exactly at the beginning
    return str.slice(longPrefix.length);
  }
  if (str.startsWith(prefix)) {
    // else prefix is exactly at the beginning
    return str.slice(prefix.length);
  }
  return str;
}

/**
 * Converts a string to a uint8 array.
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a string.
 */
export function stringToUint8Array(str: string): Uint8Array {
  /* istanbul ignore next */
  if (typeof str !== "string") {
    throw new Error(`Expected parameter str to be type string, was type ${typeof str}`);
  }

  return Uint8Array.from(Buffer.from(str));
}

/**
 * Converts a hex encoded string to a uint8 array.
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a valid hex-encoded string or is an empty string.
 */
export function hexToUint8Array(str: string): Uint8Array {
  if (!isHexString(str)) {
    throw new Error(`Input string '${str}' is not a valid hex-encoded string`);
  }
  const matches = str.match(/.{1,2}/g);
  if (matches === null) {
    throw new Error(`Input string '${str}' is not a valid hex-encoded string`);
  }
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}

/**
 * Returns true if the input is a valid hex-encoded string.
 *
 * @param str - The input string.
 * @returns - True if the input is hex-encoded.
 * @throws - Will throw if the input is not a string.
 */
export function isHexString(str: string): boolean {
  /* istanbul ignore next */
  if (typeof str !== "string") {
    throw new Error(`Expected parameter str to be type string, was type ${typeof str}`);
  }

  return /^[0-9A-Fa-f]*$/g.test(str);
}

/**
 * Convert a byte array to a hex string.
 *
 * @param byteArray - The byte array to convert.
 * @returns - The hex string.
 * @see {@link https://stackoverflow.com/a/44608819|Stack Overflow}
 */
export function toHexString(byteArray: Uint8Array): string {
  let s = "";
  byteArray.forEach(function (byte) {
    s += ("0" + (byte & 0xff).toString(16)).slice(-2);
  });
  return s;
}
