#! /bin/bash

# version: 0.2
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Debian and Ubuntu

NGINX_VERSION=1.8.0
FFMPEG_VERSION=2.8.5
MYSQL_CONNECTOR_PYTHON_VERSION=2.1.3

sudo apt-get update

sudo apt-get install -y libjpeg62-turbo-dev # for debian
sudo apt-get install -y libjpeg8-dev # for ubuntu

sudo apt-get install -y \
    apt-file \
    apt-utils \
    autoconf \
    automake \
    gcc \
    git \
    g++ \
    gfortran \
    libblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    libffi-dev \
    libfdk-aac-dev \
    libfreetype6-dev \
    libmagic1 \
    libmp3lame-dev \
    libncurses5-dev \
    libopencore-amrwb-dev \
    libopencore-amrnb-dev \
    libopus-dev \
    libpng12-dev \
    libpcre3 \
    libpcre3-dev \
    libssl-dev \
    libtool \
    mercurial \
    mysql-server \
    openssl \
    pkg-config \
    python \
    python-dev \
    python-pip \
    redis-server \
    wget

sudo pip install -i http://pypi.douban.com/simple \
    axmlparserpy \
    beautifulsoup4 \
    biplist \
    cffi \
    cryptography \
    evernote \
    filemagic \
    geoip2 \
    green \
    identicon \
    ipython \
    jieba \
    paramiko \
    paho-mqtt \
    pillow \
    ppmessage-mqtt \
    pyipa \
    pypinyin \
    pyparsing \
    python-dateutil \
    python-gcm \
    python-magic \
    qiniu \
    qrcode \
    readline \
    redis \
    rq \
    supervisor \
    sqlalchemy \
    tornado \
    xlrd \
    numpy \
    matplotlib \
    scipy \
    scikit-learn \
    git+https://github.com/senko/python-video-converter.git \
    hg+https://dingguijin@bitbucket.org/dingguijin/apns-client

cd /tmp
wget http://cdn.mysql.com//Downloads/Connector-Python/mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
tar -xzvf mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
cd mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION
sudo python setup.py install

cd /tmp
wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz
git clone https://github.com/vkholodkov/nginx-upload-module.git
cd nginx-upload-module && git checkout 2.2 && cd ../
tar -xzvf nginx-$NGINX_VERSION.tar.gz
cd nginx-$NGINX_VERSION
./configure --with-http_ssl_module \
            --add-module=../nginx-upload-module 
make && sudo make install 

cd /tmp 
wget http://ffmpeg.org/releases/ffmpeg-$FFMPEG_VERSION.tar.bz2 
tar -xjvf ffmpeg-$FFMPEG_VERSION.tar.bz2 
cd ffmpeg-$FFMPEG_VERSION 
./configure --enable-libopencore-amrnb \
            --enable-libopencore-amrwb \
            --enable-version3 \
            --enable-nonfree \
            --disable-yasm \
            --enable-libmp3lame \
            --enable-libopus \
            --enable-libfdk-aac
make && sudo make install 

cd /tmp
git clone --recursive https://github.com/maxmind/libmaxminddb
cd libmaxminddb
./bootstrap
./configure
make && sudo make install

echo "finish deployment successfully, have fun with PPMessage"
