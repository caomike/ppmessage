docker run \
       -it \
       -p 8080:8080 \
       -v ~/Documents/ppmessage:/ppmessage \
       -v ~/Documents/ppmessage-logs:/usr/local/var/log \
       -v ~/Documents/ppmessage-uploads:/user/local/opt/mdm/uploads \
       hejin/ppmessage \
       --mysql-password=test
