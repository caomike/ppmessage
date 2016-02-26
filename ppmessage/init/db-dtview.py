from db import _createDTViews
from mdm.db.common.dbinstance import getDatabaseEngine

_engine = getDatabaseEngine()
_createDTViews(_engine)



