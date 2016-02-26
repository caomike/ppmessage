# -*- coding: utf-8 -*-

import sys
import zipfile
from struct import unpack

CLASS_PREFIX = 'android/R$'

# constant type
CONSTANT_Class = 7
CONSTANT_Fieldref = 9
CONSTANT_Methodref = 10
CONSTANT_InterfaceMethodref = 11
CONSTANT_String = 8
CONSTANT_Integer = 3
CONSTANT_Float = 4
CONSTANT_Long = 5
CONSTANT_Double = 6
CONSTANT_NameAndType = 12
CONSTANT_Utf8 = 1

# all cp_info has fixed size except utf8 type
CONSTANT_SIZE = {
    CONSTANT_Class: 3,
    CONSTANT_Fieldref: 5, 
    CONSTANT_Methodref: 5,
    CONSTANT_InterfaceMethodref: 5,
    CONSTANT_String: 3,
    CONSTANT_Integer: 5,
    CONSTANT_Float: 5,
    CONSTANT_Long: 9,
    CONSTANT_Double: 9,
    CONSTANT_NameAndType: 5
    }

# access flags
ACC_PUBLIC = 0x0001
ACC_PRIVATE = 0x0002
ACC_PROTECTED = 0x0004
ACC_STATIC = 0x0008
ACC_FINAL = 0x0010
ACC_VOLATILE = 0x0040
ACC_TRANSIENT = 0x0080

ACC_MASK = ACC_PUBLIC | ACC_STATIC | ACC_FINAL

class BadClassFile(Exception):
    def __init__(self, msg=""):
        Exception.__init__(self, msg)

class PoolInfo:
    def __init__(self, tag):
        self.tag = tag
        self.data = ''

class IdField:
    def __init__(self):
        self.name = ''
        self.value = None

def error(filename, msg):
    errormsg = "error in '%s': %s" % (filename, msg)
    print >> sys.stderr, errormsg
    raise BadClassFile(errormsg)

def process_jar(jarfile):
    id_map = {}
    zfile = zipfile.ZipFile(jarfile, 'r')
    try:
        flist = zfile.namelist()
        for fname in flist:
            if fname.find(CLASS_PREFIX) != 0 or fname == CLASS_PREFIX:
                continue
            data = zfile.read(fname)
            if len(data) < 26:
                continue
            try:
                id_list = process_class(data, fname, True)
                id_map.update(id_list)
            except:
                pass
        zfile.close()
    except Exception as e:
        zfile.close()
        raise e
    return id_map

def process_class(data, filename, checkname=False):
    end = len(data)
    if end < 26:
        error(filename, "size too small")
    if '\xca\xfe\xba\xbe' != data[0:4]:
        error(filename, "magic unmatch, expecte 0xCAFEBABE")
    offset = 8
    # constant_pool_count
    (pool_count,) = unpack('>H', data[offset:offset+2])
    offset += 2

    # constant_pool[]
    constant_pool = []
    # constant_pool table is indexed from 1 to constant_pool_count-1
    constant_pool.append(None)
    for i in xrange(1, pool_count):
        if offset + 3 > end:
            error(filename, "incomplete cp_info #" % (i))
        (info_tag,) = unpack('>B', data[offset:offset+1])
        info = PoolInfo(info_tag)
        info_size = 0
        if info_tag in CONSTANT_SIZE:
            info_size = CONSTANT_SIZE[info_tag]
            if info_tag == CONSTANT_Integer:
                if offset + 5 > end:
                    error(filename, "incomplete integer cp_info #" % (i))
                (info.data,) = unpack('>I', data[offset+1:offset+5])
            elif info_tag == CONSTANT_Class:
                (info.data,) = unpack('>H', data[offset+1:offset+3])
        elif info_tag == CONSTANT_Utf8:
            (length,) = unpack('>H', data[offset+1:offset+3])
            info_size = 3 + length
            if length:
                if offset + 3 + length > end:
                    error(filename, "incomplete utf8 string cp_info #" % (i))
                strdata = data[offset+3:offset+3+length]
                # convert null (0xc080)
                strdata = strdata.replace('\xc0\x80', '')
                try:
                    strdata.decode('UTF-8')
                    info.data = strdata
                except:
                    strdata = data[offset+3:offset+3+length]
                    error(filename, "failed decode utf-8 string %s" % (''.join(["\\x%s" % binascii.hexlify(c) for c in strdata])))
        else:
            error(filename, "unknown tag %d of cp_info #%d" % (info_tag, i))

        offset += info_size
        constant_pool.append(info)

    # access_flag
    offset += 2

    # this_class
    if offset + 2 > end:
        error(filename, "this_class %d past end at %d" % (offset, end))
    (this_class,) = unpack('>H', data[offset:offset+2])
    offset += 2
    if this_class < 1 or this_class >= pool_count or constant_pool[this_class].tag != CONSTANT_Class:
        error(filename, "can not find class info for this_class #%d" % (this_class))
    name_index = constant_pool[this_class].data
    if name_index < 1 or name_index >= pool_count or constant_pool[name_index].tag != CONSTANT_Utf8:
        error(filename, "can not find class name #%d for this_class #%d" % (name_index, this_class))
    class_name = constant_pool[name_index].data
    if checkname:
        if filename != class_name + '.class':
            error(filename, "class name '%s' unmatch in jar '%s'" % (class_name, filename))
    if class_name == CLASS_PREFIX:
        error(filename, "invalid class name '%s'" % (class_name))
    if class_name.find(CLASS_PREFIX) != 0:
        error(filename, "this is not a android resource class: '%s'" % (class_name))
    brief_name = class_name[len(CLASS_PREFIX):]
    # now it should contain only brief name
    if brief_name.find('/') != -1 or brief_name.find('$') != -1 or brief_name.find('.') != -1:
        error(filename, "this is not a android resource class: '%s', '%s'" % (class_name, brief_name))

    # super_class
    offset += 2

    # interfaces_count
    if offset + 2 > end:
        error(filename, "interfaces_count %d past end at %d" % (offset, end))
    (i_count,) = unpack('>H', data[offset:offset+2])
    offset += 2
    # interfaces[]
    offset += i_count * 2
    
    # fields_count
    if offset + 2 > end:
        error(filename, "fields_count offset %d past end at %d" % (offset, end))
    (fields_count,) = unpack('>H', data[offset:offset+2])
    offset += 2
    id_fields = []
    # fields[]
    for i in xrange(0, fields_count):
        if offset + 8 > end:
            error(filename, "incomplete field #%d" % (i))
        field = IdField()
        (access_flags, name_index, desc_index, attr_count) = unpack('>HHHH', data[offset:offset+8])
        offset += 8
        # inner classes of android.R should contain only 'public final static int' fields
        if (access_flags & ACC_MASK) != ACC_MASK:
            error(filename, "non public final static filed found 0x%x #%d" % (access_flags, i))
        if name_index < 1 or name_index >= pool_count or constant_pool[name_index].tag != CONSTANT_Utf8:
            error(filename, "can not find name #%d for field #%d" % (name_index, i))
        field.name = constant_pool[name_index].data
        if desc_index < 1 or desc_index >= pool_count or constant_pool[desc_index].tag != CONSTANT_Utf8:
            error(filename, "can not find descriptor #%d for field #%d" % (desc_index, i))
        descriptor = constant_pool[desc_index].data
        if descriptor != "I":
            error(filename, "non int field found '%s' #%d" % (descriptor, i))

        for j in xrange(0, attr_count):
            if offset + 6 > end:
                error(filename, "incomplete attribute #%d of field #%d" % (j, i))
            (attr_index, attr_length) = unpack('>HI', data[offset:offset+6])
            offset += 6
            if attr_index < 1 or attr_index >= pool_count or constant_pool[attr_index].tag != CONSTANT_Utf8:
                error(filename, "can not find name #%d for attribute #%d of field #%d" % (attr_index, j, i))
            if constant_pool[attr_index].data == 'ConstantValue':
                if attr_length != 2 or offset + 2 > end:
                    error(filename, "invaild 'ConstantValue' attribute #%d of field #%d" % (j, i))
                (value_index,) = unpack('>H', data[offset:offset+2])
                if value_index < 1 or value_index > pool_count or constant_pool[value_index].tag != CONSTANT_Integer:
                    error(filename, "value #%d of 'ConstantValue' attribute #%d of field #%d are not integer" % (value_index, j, i))
                field.value = constant_pool[value_index].data
            offset += attr_length

        if field.value == None:
            error(filename, "can not find value for constant field #%d" % (i))

        id_fields.append(field)

    # ignore rest parts

    # add brief class name before field names for AndroidManifest.xml
    id_list = {}
    for field in id_fields:
        id_list[field.value] = '%s/%s' % (brief_name, field.name)

    return id_list

def process_file(fname):
    fp = open(fname, 'rb')
    data = fp.read()
    fp.close()
    return process_class(data, fname)
