# python lib needs root
hg clone https://dingguijin@bitbucket.org/dingguijin/apns-client; cd ./apns-client; sudo -H python setup.py install; cd -

git clone --recursive https://github.com/maxmind/libmaxminddb
# autoconf libtool required to bootstrap
cd libmaxminddb; ./bootstrap; ./configure; make; make install; cd -

wget -c http://dev.mysql.com/get/Downloads/Connector-Python/mysql-connector-python-2.1.3.tar.gz
tar zxvf mysql-connector-python-2.1.3.tar.gz
cd mysql-connector-python-2.1.3
sudo -H python setup.py install

