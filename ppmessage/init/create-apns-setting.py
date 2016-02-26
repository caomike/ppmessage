# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.db.common.dbinstance import getDBSessionClass
from mdm.db.models import APNSSetting

from mdm.core.p12converter import convert2pem
from mdm.core.restart import restart

from mdm.init.bootstrap.data import BOOTSTRAP_DATA

import uuid
import base64
import traceback

def _clean(dbsession):
    print "clean all apns setting..."
    dbsession.query(APNSSetting).delete()
    dbsession.commit()
    print "Done."
    return

def _create(dbsession):
    _dev_pem = None
    _pro_pem = None
    _dev_p12 = None
    _pro_p12 = None
    
    with open("imapp/ppmessage-dev.p12", "rb") as _file:
        _dev_p12 = _file.read()
        _dev_pem = convert2pem(_dev_p12)

    with open("imapp/ppmessage-pro.p12", "rb") as _file:
        _pro_p12 = _file.read()
        _pro_pem = convert2pem(_pro_p12)

    _dev_p12 = base64.b64encode(_dev_p12)
    _dev_pem = base64.b64encode(_dev_pem)
    _pro_p12 = base64.b64encode(_pro_p12)
    _pro_pem = base64.b64encode(_pro_pem)
    
    _apns = APNSSetting(
        uuid=str(uuid.uuid1()),
        app_uuid=BOOTSTRAP_DATA["app_uuid"],
        production_p12=_pro_p12,
        development_p12=_dev_p12,
        production_pem=_pro_pem,
        development_pem=_dev_pem,
        is_development=False,
        is_production=True
    )
    dbsession.add(_apns)
    dbsession.commit()        
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)

    dbsession_class = getDBSessionClass()
    dbsession = dbsession_class()
    try:
        _clean(dbsession)
        _create(dbsession)
    except:
        traceback.print_exc()
    finally:
        dbsession_class.remove()

    restart("cache.py")
