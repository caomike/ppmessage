#!/bin/bash

docker run \
       -it \
       -p 8080:8080 \
       -v ~/Documents/ppmessage:/ppmessage \
       ppmessage/ppmessage
