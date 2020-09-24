import { asciiToUint8Array } from "./utils";

/**
 * specifierLen is the length in bytes of a Specifier.
 */
const specifierLen = 16;

const specifierMap = new Set();

/**
 * Returns a specifier for given name, a specifier can only be 16 bytes so we
 * panic if the given name is too long.
 */
export function newSpecifier(name: string): Uint8Array {
  validateSpecifier(name);
  if (specifierMap.has(name)) {
	throw new Error(`ERROR: specifier name already in use: ${name}`);
  }
  specifierMap.add(name);
  const specifier = new Uint8Array(specifierLen);
  specifier.set(asciiToUint8Array(name));
  return specifier;
}

/**
 * Performs validation checks on the specifier name, it panics when the input is
 * invalid seeing we want to catch this on runtime.
 */
function validateSpecifier(name: string) {
  if (!isASCII(name)) {
	throw new Error("ERROR: specifier has to be ASCII");
  }
  if (name.length > specifierLen) {
	throw new Error("ERROR: specifier max length exceeded");
  }
}

// From https://stackoverflow.com/a/14313213/6085242
/**
 * Returns a boolean indicating whether the String contains only ASCII bytes.
 */
function isASCII(str: string): boolean {
  // eslint-disable-next-line
  return /^[\x00-\x7F]*$/.test(str);
}
