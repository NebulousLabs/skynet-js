import blake from "blakejs";

/**
 * Returns a blake2b 256bit hasher.
 */
function NewHash() {
  return blake.blake2bInit(32, null);
}

/**
 * Takes a set of byte arrays as input, adds them to the streaming hasher, and
 * then hashes the result.
 */
export function HashAll(...args: any[]): Uint8Array {
  const h = NewHash();
  for (let i=0; i < args.length; i++) {
    blake.blake2bUpdate(h, args[i]);
  }
  return blake.blake2bFinal(h);
}
