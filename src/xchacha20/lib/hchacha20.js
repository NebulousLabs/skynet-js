"use strict";

import { ChaCha20 } from "./chacha20";
import { Util } from "./util";
import { Buffer } from "buffer";

export class HChaCha20 extends ChaCha20 {
  /**
   * @param {Buffer} key
   * @param {Buffer} nonce
   * @return {Buffer}
   */
  createHCtx(key, nonce) {
    let ctx = Buffer.alloc(64, 0);
    const constant = Buffer.from("657870616e642033322d62797465206b", "hex");
    Util.toBuffer(Util.bufferToUint32Array(constant)).copy(ctx, 0, 0, 16);
    Util.toBuffer(Util.bufferToUint32Array(key)).copy(ctx, 16, 0, 32);
    Util.toBuffer(Util.bufferToUint32Array(nonce)).copy(ctx, 48, 0, 16);
    return ctx;
  }

  async hChaCha20Bytes(n, k) {
    let ctx = this.createHCtx(k, n);
    let x0 = ctx.readInt32BE(0);
    let x1 = ctx.readInt32BE(1 << 2);
    let x2 = ctx.readInt32BE(2 << 2);
    let x3 = ctx.readInt32BE(3 << 2);
    let x4 = ctx.readInt32BE(4 << 2);
    let x5 = ctx.readInt32BE(5 << 2);
    let x6 = ctx.readInt32BE(6 << 2);
    let x7 = ctx.readInt32BE(7 << 2);
    let x8 = ctx.readInt32BE(8 << 2);
    let x9 = ctx.readInt32BE(9 << 2);
    let x10 = ctx.readInt32BE(10 << 2);
    let x11 = ctx.readInt32BE(11 << 2);
    let x12 = ctx.readInt32BE(12 << 2);
    let x13 = ctx.readInt32BE(13 << 2);
    let x14 = ctx.readInt32BE(14 << 2);
    let x15 = ctx.readInt32BE(15 << 2);

    for (let i = 0; i < 10; i++) {
      [x0, x4, x8, x12] = ChaCha20.quarterRound(x0, x4, x8, x12);
      [x1, x5, x9, x13] = ChaCha20.quarterRound(x1, x5, x9, x13);
      [x2, x6, x10, x14] = ChaCha20.quarterRound(x2, x6, x10, x14);
      [x3, x7, x11, x15] = ChaCha20.quarterRound(x3, x7, x11, x15);

      [x0, x5, x10, x15] = ChaCha20.quarterRound(x0, x5, x10, x15);
      [x1, x6, x11, x12] = ChaCha20.quarterRound(x1, x6, x11, x12);
      [x2, x7, x8, x13] = ChaCha20.quarterRound(x2, x7, x8, x13);
      [x3, x4, x9, x14] = ChaCha20.quarterRound(x3, x4, x9, x14);
    }

    return Util.toBuffer(Uint32Array.from([x0, x1, x2, x3, x12, x13, x14, x15]));
  }
}
