# download nginx and upload module to current dir
wget -c http://nginx.org/download/nginx-1.8.1.tar.gz

git clone https://github.com/vkholodkov/nginx-upload-module.git
cd nginx-upload-module; git checkout 2.2; cd -

# configure; make; make install
tar zxvf nginx-1.8.1.tar.gz
cd nginx-1.8.1; ./configure --with-http_ssl_module --add-module=../nginx-upload-module; make; make install; cd -

# download ffmpeg
git clone git://anonscm.debian.org/pkg-multimedia/fdk-aac.git
wget -c http://ffmpeg.org/releases/ffmpeg-2.6.8.tar.gz

# untar
tar zxvf ffmpeg-2.6.8.tar.gz

# compile
cd fdk-aac; ./configure --disable-shared; make; make install; cd -
cd ffmpeg-2.6.8; ./configure --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-version3 --enable-nonfree --disable-yasm --enable-libmp3lame --enable-libopus --enable-libfdk-aac; make; make instal; cd -

hg clone https://dingguijin@bitbucket.org/dingguijin/apns-client; cd ./apns-client; python setup.py install; cd -

git clone --recursive https://github.com/maxmind/libmaxminddb
# autoconf libtool required to bootstrap
cd libmaxmindb; ./bootstrap; ./configure; make; make install; cd -

