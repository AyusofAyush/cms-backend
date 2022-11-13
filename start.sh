#!/bin/bash

HOSTIP=`ifconfig | awk '/inet /{print substr($2,1)}' | grep -v 127.0.0.1 | sed -n 1p`
sed -e "s/HOSTIP/${HOSTIP}/g" docker-compose.yml | docker-compose --file - up -d
