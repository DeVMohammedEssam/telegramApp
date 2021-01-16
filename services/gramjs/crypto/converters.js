"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ab2i = exports.i2ab = exports.isBigEndian = exports.ab2iBig = exports.ab2iLow = exports.i2abBig = exports.i2abLow = void 0;
/**
 * Uint32Array -> ArrayBuffer (low-endian os)
 */
function i2abLow(buf) {
    var uint8 = new Uint8Array(buf.length * 4);
    var i = 0;
    for (var j = 0; j < buf.length; j++) {
        var int = buf[j];
        uint8[i++] = int >>> 24;
        uint8[i++] = (int >> 16) & 0xFF;
        uint8[i++] = (int >> 8) & 0xFF;
        uint8[i++] = int & 0xFF;
    }
    return uint8.buffer;
}
exports.i2abLow = i2abLow;
/**
 * Uint32Array -> ArrayBuffer (big-endian os)
 */
function i2abBig(buf) {
    return buf.buffer;
}
exports.i2abBig = i2abBig;
/**
 * ArrayBuffer -> Uint32Array (low-endian os)
 */
function ab2iLow(ab) {
    var uint8 = new Uint8Array(ab);
    var buf = new Uint32Array(uint8.length / 4);
    for (var i = 0; i < uint8.length; i += 4) {
        buf[i / 4] = (uint8[i] << 24
            ^ uint8[i + 1] << 16
            ^ uint8[i + 2] << 8
            ^ uint8[i + 3]);
    }
    return buf;
}
exports.ab2iLow = ab2iLow;
/**
 * ArrayBuffer -> Uint32Array (big-endian os)
 */
function ab2iBig(ab) {
    return new Uint32Array(ab);
}
exports.ab2iBig = ab2iBig;
exports.isBigEndian = new Uint8Array(new Uint32Array([0x01020304]))[0] === 0x01;
exports.i2ab = exports.isBigEndian ? i2abBig : i2abLow;
exports.ab2i = exports.isBigEndian ? ab2iBig : ab2iLow;
