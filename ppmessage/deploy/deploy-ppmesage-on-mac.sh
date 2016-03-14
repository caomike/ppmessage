#! /bin/bash

# version: 0.1
# maintainer: Jin He <jin.he@ppmessage.com>
# description: a shell script to deploy PPMessage on Mac

MYSQL_CONNECTOR_PYTHON_VERSION=2.1.3

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install \
     autoconf \
     automake \
     fdk-aac \
     hg \
     libtool \
     libmagic \
     libjpeg \
     libffi \
     lame \
     mysql \
     mercurial \
     redis
     
brew tap homebrew/services
brew tap homebrew/nginx
brew install nginx-full --with-upload-module
brew install ffmpeg --with-fdk-aac --with-opencore-amr --with-libvorbis --with-opus


# In Mac OS X EI Captain, if your encount below error when install green,

# OSError: [Errno 1] Operation not permitted: '/var/folders/nj/ky4gzkdn0db_wdxxyph3j93h0000gn/T/pip-xoS3tF-uninstall/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six-1.4.1-py2.7.egg-info'

# try this command to install green:

# sudo pip install green --ignore-installed six

# Installing other package might have similar problem. In that case, use '--ignore-installed xxx' should do the trick.

sudo pip install -i http://pypi.douban.com/simple \
    axmlparserpy \
    beautifulsoup4 \
    biplist \
    evernote \
    filemagic \
    geoip2 \
    green \
    git+https://github.com/senko/python-video-converter.git \
    hg+https://dingguijin@bitbucket.org/dingguijin/apns-client \
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
    scikit-learn

cd /tmp
wget http://cdn.mysql.com//Downloads/Connector-Python/mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
tar -xzvf mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION.tar.gz
cd mysql-connector-python-$MYSQL_CONNECTOR_PYTHON_VERSION
sudo python setup.py install

cd /tmp
git clone --recursive https://github.com/maxmind/libmaxminddb
cd libmaxminddb
./bootstrap
./configure
make && sudo make install

echo "Finish deployment successfully, have fun with PPMessage"
