#!/bin/bash
    
# start msyql
service mysql start

# start redis-server
service redis-server start

# init env and db when use docker run to launch container
PY_SITE="`python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())"`"
if [ -f "$PY_SITE/ppmessage.pth" ]
then
    echo "not the first time run"
else
    mysqladmin -uroot password "test"
    cd /ppmessage
    ./dist.sh dev
    cd /ppmessage/ppmessage/scripts
    python table.py
    python bootstrap.py
fi

# start ppmessage
cd /ppmessage/ppmessage/scripts
python db2cache.py
cd /ppmessage
./dist.sh start

# start nginx
nginx

# access container
/bin/bash
