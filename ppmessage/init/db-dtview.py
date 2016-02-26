from db import _createDTViews
from ppmessage.db.common.dbinstance import getDatabaseEngine

_engine = getDatabaseEngine()
_createDTViews(_engine)



