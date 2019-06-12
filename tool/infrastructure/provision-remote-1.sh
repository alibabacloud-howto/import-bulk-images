#!/usr/bin/env bash

echo "LC_ALL=en_US.utf-8" >> /etc/environment
echo "LANG=en_US.utf-8" >> /etc/environment
echo "LANGUAGE=en_US.UTF-8" >> /etc/environment
export LC_ALL=en_US.utf-8
export LANG=en_US.utf-8
export LANGUAGE=en_US.UTF-8

yum update -y
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install -y nodejs
