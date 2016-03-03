
if test -d ./ppmessage
then
    echo ""
else
    echo "run download under the root ppmessage"
    exit 1
fi

if test -d ../ppmessage
then
    echo ""
else
    echo "run download under the root ppmessage"
    exit 1
fi

cd ppmessage/api/geolite2
wget -c http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
gunzip GeoLite2-City.mmdb.gz
cd -
