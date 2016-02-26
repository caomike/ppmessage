# -*- coding: utf-8 -*-

import sys
from struct import unpack

def error(msg):
    print >> sys.stderr, msg
    sys.exit(1)

def debug(msg):
    print >> sys.stdout, msg

def decode_uleb128(data, offset=0):
    '''decode leb128-encoded integer, return a tuple with value and lenth'''
    val = 0
    size = 0
    while True:
        if offset + size >= len(data):
            break
        (byte,) = unpack('B', data[offset+size:offset+size+1])
        val = val | ((byte & 0x7f) << (size * 7))
        size += 1
        if (byte & 0x80) == 0:
            # final byte has 4 bits payload
            if size == 5 and (byte & 0xf0):
                break
            return (val, size)
    error("failed to decode uleb128 integer at offset %d" % (offset))

def decode_sleb128(data, offset):
    curoff = offset
    val = 0
    while True:
        if curoff >= len(data):
            break
        (byte,) = unpack('B', data[curoff:curoff+1])
        val = val | ((byte & 0x7f) << (size * 7))
        curoffset += 1
        if (byte & 0x80) == 0:
            # final byte has 4 bits payload
            if (curoff - offset) == 5 and (byte & 0xf0):
                break
            # sign extending
            if size < 5 and (byte & 0x4f):
                # m = 1 << (size * 7 - 1)
                # (val,) = unpack('<i', pack('<I', val ^ m))
                # val -= m
                m = 32 - size * 7
                (val,) = unpack('<i', pack('<I', val << m))
                val >>= m
            return (val, curoff - offset)
    error("failed to decode sleb128 integer at offset %d" % (offset))

def parsedex(data):
    if len(data) < 0x70:
        error("incomplete header with size %d (min %d)" % (len(data), 0x70))
    if data[0:8] != 'dex\n035\x00':
        error("dex magic unmatch")
    off = 56
    (str_ids_size, str_ids_off, type_ids_size, type_ids_off) = unpack('<IIII', data[off:off+16])
    off = 96
    (class_defs_size, class_defs_off) = unpack('<II', data[off:off+8])
    off = str_ids_off
    debug("string count: %s" % (str_ids_size))
    string_ids = []
    for i in xrange(0, str_ids_size):
        (str_off,) = unpack('<I', data[off:off+4])
        off += 4
        (utf16_size, s_size) = decode_uleb128(data, str_off)
        data_off = str_off + s_size
        end = data.find('\x00', data_off, data_off + utf16_size * 3 + 1)
        if end == -1:
            error("can not find end of string #%d length=%d data-off %d %d" % (i, utf16_size, str_off, data_off))
        # TODO: support MUTF-8
        s = data[data_off:end].decode('UTF-8')
        string_ids.append(s)
        # debug("  string #%d '%s'" % (i, s))
    off = type_ids_off
    type_ids = []
    debug("type id count: %s" % (type_ids_size))
    for i in xrange(0, type_ids_size):
        (idx,) = unpack('<I', data[off:off+4])
        off += 4
        if idx >= len(string_ids):
            error("invalid type_id index %d, string id size %d" % (idx, len(string_ids)))
        type_ids.append(idx)
    off = class_defs_off
    debug("class defs count: %s" % (class_defs_size))
    w = len(str(class_defs_size))
    for i in xrange(0, class_defs_size):
        (class_idx,) = unpack('<I', data[off:off+4])
        off += 32
        if class_idx >= len(type_ids):
            error("invalid type_id index %d, string id size %d" % (idx, len(string_ids)))
        debug("  class %s %s" % (str(i).rjust(w), string_ids[type_ids[class_idx]]))
                              

if __name__ == '__main__':
    if len(sys.argv) < 2:
        error("Usage: %s <dexfile>" % (sys.path.basename(sys.argv[0])))
    fh = open(sys.argv[1], "rb")
    data = fh.read()
    fh.close()
    parsedex(data)
