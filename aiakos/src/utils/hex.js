const CryptoJS = require("crypto-js");

function arrayBufferToWordArray(ab) {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
}

export default arrayBufferToWordArray
