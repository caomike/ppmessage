/*
 * Crypto-JS v2.5.1
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2011 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

importScripts('crypto-min.js');

function sha1(m, hash) {
    var w = [];

    var H0 = hash[0], H1 = hash[1], H2 = hash[2], H3 = hash[3], H4 = hash[4];

    for(var i = 0; i < m.length; i += 16) {

        var a = H0, b = H1, c = H2, d = H3, e = H4;

        for(var j = 0; j < 80; j++) {

            if(j < 16) {
                w[j] = m[i + j] | 0;
            } else {
                var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                w[j] = (n << 1) | (n >>> 31);
            }

            var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 : j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 : j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 : (H1 ^ H2 ^ H3) - 899497514);
            H4 = H3;
            H3 = H2;
            H2 = (H1 << 30) | (H1 >>> 2);
            H1 = H0;
            H0 = t;

        }
        H0 = (H0 + a) | 0;
        H1 = (H1 + b) | 0;
        H2 = (H2 + c) | 0;
        H3 = (H3 + d) | 0;
        H4 = (H4 + e) | 0;

    }

    return [H0, H1, H2, H3, H4];

}

/*
 * (c) 2011 by md5file.com. All rights reserved.
 */

self.hash = [1732584193, -271733879, -1732584194, 271733878, -1009589776];

self.addEventListener('message', function (event) {

    var uint8_array, message, block, nBitsTotal, output, nBitsLeft, nBitsTotalH, nBitsTotalL;

    uint8_array = new Uint8Array(event.data.message);
    message = Crypto.util.bytesToWords(uint8_array);
    block = event.data.block;
    event = null;
    uint8_array = null;
    output = {
        'block' : block
    };

    if (block.end === block.file_size) {
        nBitsTotal = block.file_size * 8;
        nBitsLeft = (block.end - block.start) * 8;

        nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
        nBitsTotalL = nBitsTotal & 0xFFFFFFFF;

        // Padding
        message[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
        message[((nBitsLeft + 64 >>> 9) << 4) + 14] = nBitsTotalH;
        message[((nBitsLeft + 64 >>> 9) << 4) + 15] = nBitsTotalL;

        self.hash = sha1(message, self.hash);

        output.result = Crypto.util.bytesToHex(Crypto.util.wordsToBytes(self.hash));
    } else {
        self.hash = sha1(message, self.hash);
    }
    message = null;

    self.postMessage(output);

}, false);
