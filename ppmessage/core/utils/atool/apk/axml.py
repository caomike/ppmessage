# -*- coding: utf-8 -*-

'''
A convertor for android compiled binary xml to plain xml.
Format can be found in android source code:
    $ANDROID_ROOT/framework/base/include/util/ResourceType.h
    $ANDROID_ROOT/framework/base/include/util/ResourceTable.h
    ...

some structures:
    Chunk_header (8 bytes):
        uint16_t type
        uint16_t headerSize
        uint32_t size

    StringPool_header (28 bytes):
        Chunk_header header
        uint32_t stringCount
        uint32_t styleCount
        uint32_t flags
        uint32_t stringStart
        uint32_t styleStart

    StringPool_ref (4 bytes):
        uint32_t index

    Tree_node (16 bytes):
        Chunk_header header
        uint32_t lineNumber
        StringPool_ref comment

    Tree_attrExt (20 bytes):
        StringPool_ref ns
        StringPool_ref name
        uint16_t attributeStart
        uint16_t attributeSize
        uint16_t attributeCount
        uint16_t idIndex
        uint16_t classIndex
        uint16_t styleIndex

    Tree_endElementExt (8 bytes)
        StringPool_ref ns
        StringPool_ref name

    Res_value (8 bytes):
        uint16_t size
        uint8_t res0  # always 0
        uint8_t dataType
        uint32_t data

    Tree_attribute (20 bytes):
        StringPool_ref ns
        StringPool_ref name
        StringPool_ref rawValue
        Res_value typedValue


    ResTable_typeSpec (16 bytes):
        Chunk_header header
        uint8_t id
        uint8_t res0
        uint16_t res1
        uint32_t entryCount

    ResTable_config is a complex struct with many union, its size is 32 bytes

    ResTable_type (52 bytes):
        Chunk_header header
        uint8_t id
        uint8_t res0
        uint16_t res1
        uint32_t entryCount
        uint32_t entriesStart
        ResTable_config config

    ResTable_entry (8 bytes):
        uint16_t size
        uint16_t flags
        StringPool_ref key
'''

import sys
import os
from struct import unpack, pack

# chunk header size
HEADER_SIZE = 8
# StringPool header size
SP_HEADER_SIZE = 28
# node header size
NODE_HEADER_SIZE = 16

RES_NULL_TYPE = 0x0000
RES_STRING_POOL_TYPE = 0x0001
RES_TABLE_TYPE = 0x0002
RES_XML_TYPE = 0x0003

# Chunk types in RES_XML_TYPE
RES_XML_FIRST_CHUNK_TYPE = 0x0100
RES_XML_START_NAMESPACE_TYPE = 0x0100
RES_XML_END_NAMESPACE_TYPE = 0x0101
RES_XML_START_ELEMENT_TYPE = 0x0102
RES_XML_END_ELEMENT_TYPE = 0x0103
RES_XML_CDATA_TYPE = 0x0104
RES_XML_LAST_CHUNK_TYPE = 0x017f
# This contains a uint32_t array mapping strings in the string
# pool back to resource identifiers.  It is optional.
RES_XML_RESOURCE_MAP_TYPE = 0x0180

# Chunk types in RES_TABLE_TYPE
RES_TABLE_PACKAGE_TYPE = 0x0200
RES_TABLE_TYPE_TYPE = 0x0201
RES_TABLE_TYPE_SPEC_TYPE = 0x0202

RES_MAP = {
    RES_NULL_TYPE: 'RES_NULL_TYPE',
    RES_STRING_POOL_TYPE: 'RES_STRING_POOL_TYPE',
    RES_TABLE_TYPE: 'RES_TABLE_TYPE',
    RES_XML_TYPE: 'RES_XML_TYPE',
    RES_XML_FIRST_CHUNK_TYPE: 'RES_XML_FIRST_CHUNK_TYPE',
    RES_XML_START_NAMESPACE_TYPE: 'RES_XML_START_NAMESPACE_TYPE',
    RES_XML_END_NAMESPACE_TYPE: 'RES_XML_END_NAMESPACE_TYPE',
    RES_XML_START_ELEMENT_TYPE: 'RES_XML_START_ELEMENT_TYPE',
    RES_XML_END_ELEMENT_TYPE: 'RES_XML_END_ELEMENT_TYPE',
    RES_XML_CDATA_TYPE: 'RES_XML_CDATA_TYPE',
    RES_XML_LAST_CHUNK_TYPE: 'RES_XML_LAST_CHUNK_TYPE',
    RES_XML_RESOURCE_MAP_TYPE: 'RES_XML_RESOURCE_MAP_TYPE',
    RES_TABLE_PACKAGE_TYPE: 'RES_TABLE_PACKAGE_TYPE',
    RES_TABLE_TYPE_TYPE: 'RES_TABLE_TYPE_TYPE',
    RES_TABLE_TYPE_SPEC_TYPE: 'RES_TABLE_TYPE_SPEC_TYPE'
}

## type of data value
# Contains no data.
TYPE_NULL = 0x00
# The 'data' holds a ResTable_ref, a reference to another resource table entry.
TYPE_REFERENCE = 0x01
# The 'data' holds an attribute resource identifier.
TYPE_ATTRIBUTE = 0x02
# The 'data' holds an index into the containing resource table's
# global value string pool.
TYPE_STRING = 0x03
# The 'data' holds a single-precision floating point number.
TYPE_FLOAT = 0x04
# The 'data' holds a complex number encoding a dimension value, such as "100in".
TYPE_DIMENSION = 0x05
# The 'data' holds a complex number encoding a fraction of a container.
TYPE_FRACTION = 0x06

# Beginning of integer flavors...
TYPE_FIRST_INT = 0x10
# The 'data' is a raw integer value of the form n..n.
TYPE_INT_DEC = 0x10
# The 'data' is a raw integer value of the form 0xn..n.
TYPE_INT_HEX = 0x11
# The 'data' is either 0 or 1, for input "false" or "true" respectively.
TYPE_INT_BOOLEAN = 0x12

# Beginning of color integer flavors...
TYPE_FIRST_COLOR_INT = 0x1c
# The 'data' is a raw integer value of the form #aarrggbb.
TYPE_INT_COLOR_ARGB8 = 0x1c
# The 'data' is a raw integer value of the form #rrggbb.
TYPE_INT_COLOR_RGB8 = 0x1d
# The 'data' is a raw integer value of the form #argb.
TYPE_INT_COLOR_ARGB4 = 0x1e
# The 'data' is a raw integer value of the form #rgb.
TYPE_INT_COLOR_RGB4 = 0x1f

# ...end of integer flavors.
TYPE_LAST_COLOR_INT = 0x1f

# ...end of integer flavors.
TYPE_LAST_INT = 0x1f

# StringPool header flags
SORTED_FLAG = 1<<0
UTF8_FLAG = 1<<8

# for complex data values (TYPE_UNIT and TYPE_FRACTION)
# Where the unit type information is.  This gives us 16 possible
# types, as defined below.
COMPLEX_UNIT_SHIFT = 0
COMPLEX_UNIT_MASK = 0xf

# TYPE_DIMENSION: Value is raw pixels.
COMPLEX_UNIT_PX = 0
# TYPE_DIMENSION: Value is Device Independent Pixels.
COMPLEX_UNIT_DIP = 1
# TYPE_DIMENSION: Value is a Scaled device independent Pixels.
COMPLEX_UNIT_SP = 2
# TYPE_DIMENSION: Value is in points.
COMPLEX_UNIT_PT = 3
# TYPE_DIMENSION: Value is in inches.
COMPLEX_UNIT_IN = 4
# TYPE_DIMENSION: Value is in millimeters.
COMPLEX_UNIT_MM = 5

# TYPE_FRACTION: A basic fraction of the overall size.
COMPLEX_UNIT_FRACTION = 0
# TYPE_FRACTION: A fraction of the parent size.
COMPLEX_UNIT_FRACTION_PARENT = 1

# Where the radix information is, telling where the decimal place
# appears in the mantissa.  This give us 4 possible fixed point
# representations as defined below.
COMPLEX_RADIX_SHIFT = 4
COMPLEX_RADIX_MASK = 0x3

# The mantissa is an integral number -- i.e., 0xnnnnnn.0
COMPLEX_RADIX_23p0 = 0
# The mantissa magnitude is 16 bits -- i.e, 0xnnnn.nn
COMPLEX_RADIX_16p7 = 1
# The mantissa magnitude is 8 bits -- i.e, 0xnn.nnnn
COMPLEX_RADIX_8p15 = 2
# The mantissa magnitude is 0 bits -- i.e, 0x0.nnnnnn
COMPLEX_RADIX_0p23 = 3

# Where the actual value is.  This gives us 23 bits of
# precision.  The top bit is the sign.
COMPLEX_MANTISSA_SHIFT = 8
COMPLEX_MANTISSA_MASK = 0xffffff


class StringPool:
    def __init__(self):
        self.stringCount = 0
        self.flag = 0
        self.entries = []

    def get_string(self, idx):
        if idx >= 0 and idx < self.stringCount:
            return self.entries[idx]
        else:
            return None

class ResObject:
    def __init__(self):
        self.id_map = {}
        self.name_map = {}

    def add(self, item):
        if self.id_map.has_key(item.id):
            name = self.id_map[item.id].name
            if name != item.name:
                return False
        self.id_map[item.id] = item
        self.name_map[item.name] = item
        return True

    def update(self, resource):
        for item in resource.id_map.values():
            self.add(item)

    def get_by_id(self, objid):
        return self.id_map.get(objid)

    def get_by_name(self, name):
        return self.name_map.get(name)

class ResIdObject(ResObject):
    def __init__(self, myid, name):
        ResObject.__init__(self)
        self.id = myid
        self.name = name

class ResPackage(ResIdObject):
    def __init__(self, pkgid, name):
        self.typePool = None
        self.keyPool = None
        ResIdObject.__init__(self, pkgid, name)

class ResValue:
    def __init__(self, size, res0, dataType, data):
        self.size = size
        self.res0 = res0
        self.dataType = dataType
        self.data = data

class ResTableEntry:
    INDEX_ATTR = 0x00

    FLAG_COMPLEX = 0x0001

    # no entry defined
    NO_ENTRY = 0xffffffff

    TYPE_ENUM = 1 << 16
    TYPE_FLAGS = 1 << 17

    def __init__(self, eid, name, key, flags, size):
        self.id = eid
        self.name = name
        self.key = key
        self.flags = flags
        self.size = size
        self.value = None

        self.typecode = 0
        # indicate resolve staus of extra
        #   None:  not resolved
        #   False: resolve failed
        #   True:  resolve succeed
        self.resolved = None
        self.extra = {}

class XMLAttribute:
    def __init__(self, name, value):
        self.name = name
        self.value = value

class XMLNode:
    def __init__(self, name, isText=False):
        self.name = name
        self.attributes = []
        self.children = []
        self.isText = isText
        self.parent = None

    def addChild(self, node):
        self.children.append(node)
        node.parent = self

    def addAttr(self, attr):
        self.attributes.append(attr)

    def dump(self, outfile=sys.stdout, ns=None, indent="    ", depth=0):
        if depth == 0:
            outfile.write('<?xml version="1.0" encoding="utf-8"?>\n')
        prefix = indent * depth
        if self.isText:
            outfile.write("%s%s\n" % (prefix, self.name))
            return
        outfile.write('%s<%s' % (prefix, self.name))
        if ns:
            outfile.write(' xmlns:%s="%s"' % (ns[0], ns[1]))
        # on same line for sole attribute
        if ns == None and len(self.attributes) == 1:
            attr = self.attributes[0]
            outfile.write(' %s="%s"' % (attr.name, attr.value))
        else:
            for attr in self.attributes:
                outfile.write('\n%s%s%s="%s"' % (prefix, indent, attr.name, attr.value))
        if self.children:
            outfile.write('>\n')
            for node in self.children:
                node.dump(outfile, None, indent, depth+1)
            outfile.write('%s</%s>\n' % (prefix, self.name))
        else:
            outfile.write(' />\n')


def error(msg):
    # print >> sys.stderr, "Error: ", msg
    raise Exception(msg)

def print_debug(msg):
    print >> sys.stderr, msg

def int2float(value):
    '''interpret bytes int as float'''
    s = pack("<I", value)
    return unpack("f", s)

def print_float(value):
    strval = "%f" % (value)
    # strip trailing zeros
    if strval.find(".") != -1:
        strval = strval.rstrip("0").rstrip(".")
        if strval == "":
            strval = "0"
    return strval
    
class AXMLParser:
    def __init__(self, data, debug=False):
        self.data = data
        self.debug = debug

        self.restable = ResObject()

        self.namespaces = []
        self.savedns = []
        self.depth = 0
        self.strpool = StringPool()
        self.strpool_found = False
        self.resids = []
        self.error = False
        self.curnode = XMLNode("")

        self.mantissa_mult = 1.0 / (1 << COMPLEX_MANTISSA_SHIFT)
        self.radix_mults = []
        self.radix_mults.append(1.0 * self.mantissa_mult)
        self.radix_mults.append(1.0 / ( 1 << 7) * self.mantissa_mult)
        self.radix_mults.append(1.0 / ( 1 << 15) * self.mantissa_mult)
        self.radix_mults.append(1.0 / ( 1 << 23) * self.mantissa_mult)
        

    def make_res_id(self, pkgid, typeid, entryid):
        return ((0xff000000 & (pkgid << 24)) |
                (0x00ff0000 & ((typeid) << 16)) |
                (0x0000ffff & (entryid)) )

    def decode_res_id(self, resid):
        pkgid = (resid >> 24) & 0xff
        typeid = (resid >> 16) & 0xff
        entryid = resid & 0xffff
        return (pkgid, typeid, entryid)

    def set_restable(self, restable):
        self.restable = restable

    def get_intattr_valuestr(self, pkgname, name, data, value_type):
        valuestr = "%d" % (data)
        if value_type != TYPE_INT_DEC and value_type != TYPE_INT_HEX:
            return valuestr
        if value_type == TYPE_INT_HEX:
            valuestr = "0x%x" % (data)
        # one pass loop, just for quick break
        for i in xrange(0, 1):
            if self.restable == None:
                break
            pkgname = pkgname.rstrip(":")
            if pkgname == "":
                break
            package = self.restable.get_by_name(pkgname)
            if package == None:
                break
            attr_type = package.get_by_name('attr')
            if attr_type == None:
                break
            entry = attr_type.get_by_name(name)
            if entry == None:
                break
            if value_type == TYPE_INT_DEC and not (entry.typecode & ResTableEntry.TYPE_ENUM):
                break
            if value_type == TYPE_INT_HEX and not (entry.typecode & ResTableEntry.TYPE_FLAGS):
                break
            if entry.resolved == None:
                self.resolve_attr_extra(entry)
            if not entry.resolved:
                break
            if value_type == TYPE_INT_DEC:
                for (k, v) in entry.extra.items():
                    if k == data:
                        return str(v)
                break
            else:
                # more than one flag may set same bit
                val = 0
                include = []
                for (k, v) in entry.extra.items():
                    if data == k:
                        return v
                    if (k & data) == k and data != 0:
                        val = val | k
                        include.append(k)
                if val != data:
                    break
                # flag may be redundant
                if len(include) > 1:
                    keep = [True] * len(include)
                    include.sort()
                    size = len(include)
                    for i in xrange(0, size):
                        val = 0
                        for j in xrange(0, size):
                            if j != i and keep[j]:
                                val = val | include[j]
                        if (val | include[i]) == val:
                            keep[i] = False
                    rest = []
                    for i in xrange(0, size):
                        if keep[i]:
                            rest.append(include[i])
                    include = rest
                # never true, just in case
                if len(include) < 1:
                    break
                return '|'.join([entry.extra[k] for k in include])
        return valuestr

    def resolve_attr_extra(self, entry):
        if entry.resolved != None:
            return
        extra = {}
        for (k, v) in entry.extra.items():
            ref = self.dereference_resource(v)
            if ref == None:
                entry.resolved = False
                return
            (pkgname, typename, entryname) = ref
            if typename != "id":
                entry.resolved = False
                return
            extra[k] = entryname
        entry.resolved = True
        entry.extra = extra

    def dereference_resource(self, resid):
        if self.restable == None:
            return None
        (pid, tid, eid) = self.decode_res_id(resid)
        package = self.restable.get_by_id(pid)
        if package == None:
            return None
        restype = package.get_by_id(tid)
        if restype == None:
            return None
        entry = restype.get_by_id(eid)
        if entry == None:
            return None
        return (package.name, restype.name, entry.name)

    def resolve_string(self, pkg_name, res_name):
        if self.restable == None:
            return None
        package = self.restable.get_by_name(pkg_name)
        if package == None:
            return None
        strs = package.get_by_name('string')
        if strs == None:
            return None
        entry = strs.get_by_name(res_name)
        if entry == None:
            return None
        if entry.value and entry.value.dataType == TYPE_STRING:
            return self.strpool.get_string(entry.value.data)
        else:
            return None

    def get_refer_name(self, resid):
        refer = self.dereference_resource(resid)
        if refer == None:
            return "0x%08x" % (resid)
        (pkgname, typename, entryname) = refer
        if pkgname == "android":
            return "android:%s/%s" % (typename, entryname)
        else:
            return "%s/%s" % (typename, entryname)

    def get_attr_attr_value(self, resid, name, rawvalue):
        refer = self.dereference_resource(resid)
        if refer:
            (pkgname, typename, entryname) = refer
            if typename == "attr":
                if pkgname == "android":
                    return "?android:attr/%s" % (entryname)
                else:
                    return "?attr/%s" % (entryname)
        if rawvalue == None:
            return "?0x%08x" % (resid)
        else:
            return rawvalue

    def get_color_str(self, color, color_type):
        if color_type == TYPE_INT_COLOR_ARGB8:
            # '#aarrggbb'
            return "#%08x" % (color)
        elif color_type == TYPE_INT_COLOR_RGB8:
            # '#rrggbb'
            color = color & 0x00ffffff
            return "#%06x" % (color)
        elif color_type == TYPE_INT_COLOR_ARGB4:
            # '#argb'
            c = color & 0x000f
            c = (color >> 4) & 0x00f0 | c
            c = (color >> 8) & 0x0f00 | c
            c = (color >> 12) & 0xf000 | c
            return "#%04x" % (c)
        elif color_type == TYPE_INT_COLOR_RGB4:
            # '#rgb'
            c = color & 0x000f
            c = (color >> 4) & 0x00f0 | c
            c = (color >> 8) & 0x0f00 | c
            return "#%03x" % (c)
        else:
            return "(color)0x08x" % (color)

    def decode_complex(self, complexvalue, isfraction):
        value = ((complexvalue & (COMPLEX_MANTISSA_MASK << COMPLEX_MANTISSA_SHIFT))
                 * self.radix_mults[(complexvalue >> COMPLEX_RADIX_SHIFT) & COMPLEX_RADIX_MASK])
        strval = print_float(value)
        unit = ((complexvalue >> COMPLEX_UNIT_SHIFT) & COMPLEX_UNIT_MASK)
        if not isfraction:
            if unit == COMPLEX_UNIT_PX:
                strval += "px"
            elif unit == COMPLEX_UNIT_DIP:
                strval += "dp"
            elif unit == COMPLEX_UNIT_SP:
                strval += "sp"
            elif unit == COMPLEX_UNIT_PT:
                strval += "pt"
            elif unit == COMPLEX_UNIT_IN:
                strval += "in"
            elif unit == COMPLEX_UNIT_MM:
                strval += "mm"
            else:
                strval += " (unknown unit)"
        else:
            # ??%, strip leading '0.'
            if strval.startswith("0.") and len(strval) > 2:
                strval = strval[2:]
            if unit == COMPLEX_UNIT_FRACTION:
                strval += "%"
            elif unit == COMPLEX_UNIT_FRACTION_PARENT:
                strval += "%p"
            else:
                strval += " (unknown unit)"
        return strval

    def parse_header(self, offset, debugenabled=False):
        data = self.data
        debug = self.debug and debugenabled
        if offset + HEADER_SIZE > len(data):
            error("incomplete chunk header at offset %d" % (offset))
        (htype, hsize, size) = unpack('<HHI', data[offset:offset+HEADER_SIZE])
        if debug:
            if htype in RES_MAP:
                tname = RES_MAP[htype]
            else:
                tname = ""
            print_debug("chunk (%#06x, %d, %d) offset %d %s" % (htype, hsize, size, offset, tname))
        if hsize < HEADER_SIZE or hsize + offset > len(data):
            error("invaid header size %d at offset %d with total size %d" % (hsize, offset, len(data)))
        if hsize > size:
            error("header size %d > chunk size %d at offset %d" % (hsize, size, offset))
        if size + offset > len(data):
            error("invaild chunk size %d at offset %d with total size %d" % (size, offset, len(data)))
        if (hsize | hsize) & 0x03:
            error("header size %d or chunk %d size not aligned by word at offset %d" % (hsize, size, offset))
        return (htype, hsize, size)
    
    def parse_resourcemap(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        resids = []
        for off in xrange(offset + hsize, offset + size, 4):
            (resid,) = unpack('<I', data[off:off+4])
            resids.append(resid)
        return resids
    
    def parse_stringpool(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        if hsize < SP_HEADER_SIZE:
            error("invalid StringPool header (%#06x, %d, %d) offset %d, min size is %d" % (htype, hsize, size, offset, SP_HEADER_SIZE))
        (stringCount, styleCount, flags, stringStart, styleStart) = unpack("<IIIII", data[offset+HEADER_SIZE:offset+SP_HEADER_SIZE])
        sp = StringPool()
        sp.stringCount = stringCount
        sp.styleCount = styleCount
        sp.flags = flags
        if debug:
            print_debug("StringPool (%#06x, %d, %d) offset %d, stringCount=%d, styleCount=%d, flags=%#x, stringStart=%d, styleStart=%d" % (htype, hsize, size, offset, stringCount, styleCount, flags, stringStart, styleStart))
        if stringCount > 0:
            if hsize + stringCount * 4 > size:
                error("Bad string block: string index array with %d items extends past chunk size %d" % (stringCount, size))
            off = offset + hsize
            for i in xrange(0, stringCount):
                (index,) = unpack('<I', data[off:off+4])
                sp.entries.append(index)
                off += 4
            if stringStart >= size:
                error("Bad string block: string pool starts at %d after chunk size %d" % (stringStart, size))
            if styleCount == 0:
                poolsize = size - stringStart
            else:
                if styleStart <= stringStart:
                    error("Bad string block: style block starts at %d before strings at %d" % (stringStart, styleStart))
                poolsize = styleStart - stringStart
            if poolsize == 0:
                error("Bad string block: stringCount is %d but pool size is 0" % (stringCount))
            pooloff = offset + stringStart
            for i in xrange(0, len(sp.entries)):
                off = sp.entries[i]
                if off + 1 > poolsize:
                    error("Bad string block: string #%d entry is at %d, past end at %d" % (i, off, poolsize))
                off += pooloff
                if flags & UTF8_FLAG:
                    (outLen,) = unpack('B', data[off:off+1])
                    off += 1
                    if outLen & 0x80:
                        (tempval,) = unpack('B', data[off:off+1])
                        outLen = ((outLen & 0x7f) << 8) | tempval
                        off += 1
                    (strlen,) = unpack('B', data[off:off+1])
                    off += 1
                    if strlen & 0x80:
                        (tempval,) = unpack('B', data[off:off+1])
                        strlen = ((strlen & 0x7f) << 8) | tempval
                        off += 1
                    if off + strlen >= poolsize + pooloff:
                        error("Bad string block: string #%d entry is at %d with length %d past end at %d" % (i, off, strlen, poolsize+pooloff))
                    # if debug:
                    #     print_debug("  string #%d %d %d %d" % (i, pooloff + sp.entries[i], off, strlen))
                    s = data[off:off+strlen].decode('UTF-8').encode('UTF-8')
                else:
                    (strlen,) = unpack('<H', data[off:off+2])
                    off += 2
                    if strlen & 0x8000:
                        (tempval,) = unpack('<H', data[off:off+2])
                        strlen = ((strlen & 0x7fff) << 16) | tempval
                        off += 2
                    strlen *= 2
                    if off + strlen >= poolsize + pooloff:
                        error("Bad string block: string #%d entry is at %d with length %d past end at %d" % (i, off, strlen, poolsize + pooloff))
                    # if debug:
                    #     print_debug("  string #%d %d %d %d" % (i, pooloff + sp.entries[i], off, strlen))
                    s = data[off:off+strlen].decode('UTF-16LE').encode('UTF-8')
                sp.entries[i] = s
                # if debug:
                #     print_debug("    [%d] %d %d" % (i, off, strlen))
        return sp

    def parse_startns(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        off = offset + hsize
        (prefixid, uriid) = unpack('<II', data[off:off+8])
        prefix = self.strpool.get_string(prefixid)
        if prefix == None:
            error("namespace prefix #%d not found in pool" % (prefixid))
        uri = self.strpool.get_string(uriid)
        if uri == None:
            error("namespace uri #%d not found in pool" % (uriid))
        self.namespaces.append((prefix, uri))
        self.savedns.append((prefix, uri))
        if debug:
            print_debug("  NS %s=%s" % (prefix, uri))

    def parse_endns(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        off = offset + hsize
        (prefixid, uriid) = unpack('<II', data[off:off+8])
        prefix = self.strpool.get_string(prefixid)
        if prefix == None:
            error("namespace prefix #%d not found in pool" % (prefixid))
        uri = self.strpool.get_string(uriid)
        if uri == None:
            error("namespace uri #%d not found in pool" % (uriid))
        if len(self.namespaces) < 1:
            error("end namespace %s:%s without start namespace" % (prefix, uri))
        start = self.namespaces.pop()
        if start[0] != prefix or start[1] != uri:
            error("end namespace %s:%s unmatch start %s:%s" % (prefix, uri, start[0], start[1]))

    def get_namespace(self, nsid):
        ns = self.strpool.get_string(nsid)
        if ns:
            for item in self.namespaces:
                if ns == item[1]:
                    return item[0] + ":"
            return ns + ":"
        return ""

    def parse_starttag(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        off = offset + hsize
        (nsid, nameid, attrStart, attrSize, attrCount, idIndex, classIndex, styleIndex) = unpack('<IIHHHHHH', data[off:off+20])
        if debug:
            print_debug("  ELEMENT ns=%d name=%d, attrStart=%d, attrSize=%d, attrCount=%d, idIndex=%d, classIndex=%d, styleIndex=%d" % (nsid, nameid, attrStart, attrSize, attrCount, idIndex, classIndex, styleIndex))
        ns = self.get_namespace(nsid)
        name = self.strpool.get_string(nameid)
        if name == None:
            error("can not get element name #%d in pool" % (nameid))
        node = XMLNode(ns + name)
        self.curnode.addChild(node)
        self.curnode = node
        if debug:
            print_debug("  ELEMENT %s" % (node.name))
        off = offset + hsize + attrStart
        for i in xrange(0, attrCount):
            (nsid, nameid, valueid, a_size, a_res0, a_type, a_data) = unpack('<IIIHBBI', data[off:off+20])
            if debug:
                print_debug("    ATTR ns=%d, name=%d, value=%d, size=%d, type=0x%02x, data=%d" % (nsid, nameid, valueid, a_size, a_type, a_data))
            off += attrSize
            ns = self.get_namespace(nsid)
            name = self.strpool.get_string(nameid)
            if name == None:
                error("can not get attribute name #%d in pool" % (nameid))
            fullname = ns + name
            if a_type == TYPE_NULL:
                value = "(null)"
            elif a_type == TYPE_REFERENCE:
                value = self.get_refer_name(a_data)
                # new id
                if fullname == "android:id":
                    value = "@+%s" % (value)
                else:
                    value = "@%s" % (value)
            elif a_type == TYPE_ATTRIBUTE:
                value = self.get_attr_attr_value(a_data, name, self.strpool.get_string(valueid))
            elif a_type == TYPE_STRING:
                value = self.strpool.get_string(valueid)
                if value == None:
                    error("can not get string attribute value #%d in pool" % (valueid))
            elif a_type == TYPE_FLOAT:
                value = print_float(int2float(a_data))
            elif a_type == TYPE_DIMENSION:
                value = self.decode_complex(a_data, False)
            elif a_type == TYPE_FRACTION:
                value = self.decode_complex(a_data, True)
            elif a_type == TYPE_INT_DEC:
                value = self.get_intattr_valuestr(ns, name, a_data, a_type)
            elif a_type == TYPE_INT_HEX:
                value = self.get_intattr_valuestr(ns, name, a_data, a_type)
            elif a_type == TYPE_INT_BOOLEAN:
                value = a_data == 0 and "false" or "true"
            elif a_type >= TYPE_FIRST_COLOR_INT and a_type <= TYPE_LAST_COLOR_INT:
                value = self.get_color_str(a_data, a_type)
            else:
                value = "(type 0x%x)0x%x" % (a_type, a_data)
            attr = XMLAttribute(fullname, value)
            node.addAttr(attr)
            if debug:
                print_debug("    ATTR %s=%s" % (attr.name, attr.value))

    def parse_endtag(self, offset):
        data = self.data
        debug = self.debug
        if self.curnode.parent == None:
            error("end tag without matched start tag  (0x%04x, %d, %d) offset %d" % (htype, hsize, size, offset))
        self.curnode = self.curnode.parent

    def parse_textnode(self, offset):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        off = offset + hsize
        (textid,) = unpack('<I', data[off:off+4])
        text = self.strpool.get_string(textid)
        if text == None:
            text = ""
        node = XMLNode(text, True)
        self.curnode.addChild(node)

    def parsexml(self):
        data = self.data
        offset = 0
        if len(data) < 8:
            error("invalid binary xml ( size < 8)")
        (htype, hsize, size) = self.parse_header(offset, True)
        if htype != RES_XML_TYPE:
            error("invalid binary xml with header type 0x%04x (expect %#06x)" % (htype, RES_XML_TYPE))
        offset += hsize
        depth = 0
        while offset < len(data):
            (htype, hsize, size) = self.parse_header(offset, True)
            if htype == RES_STRING_POOL_TYPE:
                # if strpool:
                #     error("duplicate StringPool (0x%04x, %d, %d) offset %d" % (htype, hsize, size, offset))
                self.strpool = self.parse_stringpool(offset)
                self.strpool_found = True
            elif htype == RES_XML_RESOURCE_MAP_TYPE:
                self.resids = self.parse_resourcemap(offset)
            elif htype >= RES_XML_FIRST_CHUNK_TYPE and htype <= RES_XML_LAST_CHUNK_TYPE:
                if hsize < NODE_HEADER_SIZE:
                    error("invalid tree node header (0x%04x, %d, %d) offset %d, min size is %d" % (htype, hsize, size, offset, NODE_HEADER_SIZE))
                if htype == RES_XML_START_ELEMENT_TYPE:
                    self.parse_starttag(offset)
                elif htype == RES_XML_END_ELEMENT_TYPE:
                    self.parse_endtag(offset)
                elif htype == RES_XML_START_NAMESPACE_TYPE:
                    self.parse_startns(offset)
                elif htype == RES_XML_END_NAMESPACE_TYPE:
                    self.parse_endns(offset)
                elif htype == RES_XML_CDATA_TYPE:
                    self.parse_textnode(offset)
            else:
                print_debug("Skipping unknown chunk: (0x04x, %d, %d) offset %d" % (htype, hsize, size, offset))
            offset += size

        if len(self.curnode.children) > 1:
            error("multiple element at toplevel")
        root = self.curnode.children[0]
        if self.savedns:
            return (root, self.savedns[-1])
        else:
            return (root, None)

class ResourceParser(AXMLParser):
    def __init__(self, data, debug=False):
        AXMLParser.__init__(self, data, debug)

    def parse_table_spectype(self, offset=0):
        data = self.data
        debug = self.debug
        (htype, hsize, size) = self.parse_header(offset)
        off = offset + HEADER_SIZE
        (specId,) = unpack('B', data[off:off+1])
        off += 4
        (entryCount,) = unpack('<I', data[off:off+4])
        # check int overflow when multiplying by 4
        if entryCount > (1 << 30) or hsize + 4 * entryCount > size:
            error("ResTable_typeSpec entry extends beyond chunk end %d" % (size))
        if specId == 0:
            error("ResTable_typeSpec has id of 0")
        if debug:
            print_debug("  ResTable_typeSpec id=%d entryCount=%d" % (specId, entryCount))

        # off = offset + hsize
        # for i in xrange(0, entryCount):
        #     (flag,) = unpack('<I', data[off:off+4])
        #     off += 4
        #     print_debug("    flag #%d 0x%08x" % (i, flag))

    def parse_table_typetype(self, package, offset=0):
        data = self.data
        debug = self.debug

        if package.typePool == None or package.keyPool == None:
            print_debug("[WARN] ResTable_type before type or key pool")
            return
        (htype, hsize, size) = self.parse_header(offset)
        if hsize < 48:
            error("ResTable_type header size %d less than 52" % (hsize))
        off = offset + HEADER_SIZE
        (typeid,) = unpack('B', data[off:off+1])
        off += 4
        (entryCount, entriesStart) = unpack('<II', data[off:off+8])
        typeindex = typeid - 1
        if debug:
            print_debug("  ResTable_type id=%d entryCount=%d entriesStart=%d %s"
                        % (typeid, entryCount, entriesStart, package.typePool.get_string(typeindex)))
        if hsize + 4 * entryCount > size:
            error("ResTable_type entry extends beyond chunk end")
        if entryCount != 0 and entriesStart > (size - 8):
            error("ResTable_type entriesStart at %d extends chunk end %d" % (entriesStart, size))
        if typeid == 0:
            error("ResTable_type has id of 0")
        typename = package.typePool.get_string(typeindex)
        if typename == None:
            print_debug("ResTable_type skip type %d not in pool" % (typeid))
            return
        if entryCount == 0:
            return
        restype = package.get_by_id(typeid)
        if restype == None:
            restype = ResIdObject(typeid, typename)
            package.add(restype)
        end = offset + size
        indexoff = offset + hsize
        for i in xrange(0, entryCount):
            (index,) = unpack('<I', data[indexoff:indexoff+4])
            if i == entryCount - 1:
                entryend = end
            else:
                (entryend,)  = unpack('<I', data[indexoff+4:indexoff+8])
                entryend += offset + entriesStart
            entryend = min(end, entryend)
            indexoff += 4
            if index == ResTableEntry.NO_ENTRY:
                continue
            off = offset + entriesStart + index
            if off + 8 > entryend:
                error("ResTable_type entry #%d position to %d extends boundary" % (i, entriesStart + index))
            (entrysize, flags, key) = unpack('<HHI', data[off:off+8])
            # typical value of entry size  is 16
            if entrysize < 8:
                error("ResTable_type entry #%d at offset %d too small size %d" % (i, off, entrysize))
            if entrysize + off > entryend:
                error("ResTable_type entry #%d at offset %d size %d extends boundary %d" % (i, off, entrysize, entryend))
            if debug:
                print_debug("    entry #%d size=%d flags=0x%04x key=%d" % (i, entrysize, flags, key))
            entryname = package.keyPool.get_string(key)
            if entryname == None:
                error("can not get entry #%d name with index %d" % (i, key))
            resentry = restype.get_by_id(i)
            if resentry == None:
                resentry = ResTableEntry(i, entryname, key, flags, entrysize)
                if not restype.add(resentry):
                    continue
            else:
                # only keep entry in first config
                continue
            resid = self.make_res_id(package.id, typeindex, i)
            if debug:
                print_debug("    resource entry 0x%08x %s/%s" % (resid, restype.name, resentry.name))

            if flags & ResTableEntry.FLAG_COMPLEX == 0:
                off += entrysize
                (v_size, v_res0, v_type, v_data) = unpack('<HBBI', data[off:off+8])
                resentry.value = ResValue(v_size, v_res0, v_type, v_data)
                
            elif restype.name == 'attr' and flags & ResTableEntry.FLAG_COMPLEX:
                # for attr type, parse more info (eg. flags or enum valus)
                off += entrysize

                self.parse_attr_extra(package, resentry, off, entryend)

    def parse_attr_extra(self, package, resentry, off, entryend):
        data = self.data
        debug = self.debug
        # iterate ResTable_map array
        first = True
        extra_items = {}
        while off + 12 <= entryend:
            (name_ref, map_size) = unpack('<IH', data[off:off+6])
            (map_type, map_data) = unpack('<BI', data[off+7:off+12])
            if map_size < 8:
                error("ResTable_map [%d] has invalid size %d" % (off, map_size))
            # we are processing an array, all item should has same size (4 + 8 = 12 bytes so far)
            if map_size > 8:
                print_debug("ResTable_map [%d] has unexpected size %d" % (off, map_size))
            if debug:
                print_debug("      ResTable_map [%d] 0x%08x 0x%02x 0x%02x 0x%08x"
                            % (off, name_ref, map_size, map_type, map_data))
            
            off += 12
            # first map entry must be attribute type code
            if first:
                if name_ref != 0x01000000 or map_type != TYPE_INT_DEC:
                    return
                # just process enum and flags
                resentry.typecode = map_data
                # typecode can be 'or' of several type, such as TYPE_DIMENSION | TYPE_ENUM
                if (map_data & (ResTableEntry.TYPE_ENUM | ResTableEntry.TYPE_FLAGS)) == 0:
                    return
                first = False
                continue
            # skip internal spec (eg. min or max value for integral attribute) of attr
            if name_ref <= 0x01000009:
                continue
            # now, remains only flags and enum item
            if (resentry.typecode & ResTableEntry.TYPE_ENUM) and map_type != TYPE_INT_DEC:
                continue
            # old sdk may use TYPE_INT_DEC for TYPE_FLAGS
            # if (resentry.typecode & ResTableEntry.TYPE_FLAGS) and map_type != TYPE_INT_HEX:
            #     continue

            # name_ref should refer to an id resource entry, whose name is flag or enum name
            # map_data if flag or enum value
            # defer name dereference as 'id' may not parsed
            extra_items[map_data] = name_ref
        resentry.extra = extra_items

    def parse_package(self, offset=0):
        data = self.data
        debug = self.debug
        (htype, hsize, size, pkgid) = unpack('<HHII', data[offset:offset+12])

        if pkgid < 1 or pkgid >= 256:
            print_debug("Skins not supported (package id: %d)" % (pkgid))
            return
        off = offset + 12
        # package name are UTF-16 encoded with NULL terminated, 128 * 2 bytes at most
        end = off
        while end < off + 256 and data[end:end+2] != '\x00\x00':
            end += 2
        pkgname = data[off:end].decode('UTF-16LE')
        off += 256
        (typeStrings, lastPublicType, keyStrings, lastPublicKey) = unpack('<IIII', data[off:off+16])
        if debug:
            print_debug("package: %d %s typePool=%d keyPool=%d" % (pkgid, pkgname, typeStrings, keyStrings))
        package = ResPackage(pkgid, pkgname)
        off = offset + hsize
        pkgend = offset + size
        while off + 8 <= pkgend:
            (htype, hsize, size) = self.parse_header(off, True)
            if htype == RES_TABLE_TYPE_SPEC_TYPE:
                self.parse_table_spectype(off)
            elif htype == RES_TABLE_TYPE_TYPE:
                self.parse_table_typetype(package, off)
            elif htype == RES_STRING_POOL_TYPE:
                if off == offset + typeStrings:
                    package.typePool = self.parse_stringpool(off)
                elif off == offset + keyStrings:
                    package.keyPool = self.parse_stringpool(off)
                else:
                    print_debug("skip extra string pool at %d in ResPackage" % (off))
            else:
                print_debug("Unknown chunk type 0x%04x in package chunk" % (htype))
            off += size
        return package

    def parse_resources(self):
        offset = 0
        data = self.data
        debug = self.debug
        res_table = ResObject()
        if len(data) < 12:
            error("invalid resource table file ( size < 12)")
        (htype, hsize, size) = self.parse_header(offset, True)
        if htype != RES_TABLE_TYPE:
            error("invalid resource file with header type 0x%04x (expect %#04x)" % (htype, RES_TABLE_TYPE))
        (pkg_count,) = unpack('<I', data[offset+8:offset+12])
        offset += hsize
        pkg_list = []
        while offset < len(data):
            (htype, hsize, size) = self.parse_header(offset, True)
            if htype == RES_STRING_POOL_TYPE:
                if self.strpool_found:
                    print_debug("duplicate StringPool (0x%04x, %d, %d) offset %d" % (htype, hsize, size, offset))
                else:
                    self.strpool = self.parse_stringpool(offset)
            elif htype == RES_TABLE_PACKAGE_TYPE:
                package = self.parse_package(offset)
                pkg_list.append(package)
            else:
                print_debug("Skipping unknown chunk: (0x04x, %d, %d) offset %d" % (htype, hsize, size, offset))
            offset += size

        # some apk contains two package, one is 'android', drop it
        drop_android = (len(pkg_list) > 1)
        for pkg in pkg_list:
            if not drop_android or pkg.name != 'android':
                res_table.add(package)
        return res_table
