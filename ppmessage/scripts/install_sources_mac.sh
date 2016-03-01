# python lib needs root
hg clone https://dingguijin@bitbucket.org/dingguijin/apns-client; cd ./apns-client; sudo -H python setup.py install; cd -

git clone --recursive https://github.com/maxmind/libmaxminddb
# autoconf libtool required to bootstrap
cd libmaxminddb; ./bootstrap; ./configure; make; make install; cd -

