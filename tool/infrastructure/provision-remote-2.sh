#!/usr/bin/env bash
cd /usr/local/src/app/server/
npm install
cd static/
npm install
npm run build
cd ..
npm install forever -g
forever -w start server.js
systemctl enable firewalld
systemctl start firewalld
firewall-cmd --add-forward-port=port=80:proto=tcp:toport=3000
sleep 10
