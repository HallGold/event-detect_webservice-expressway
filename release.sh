#!/bin/bash


# this script is to build js code and pack a 'Expressway.tar.gz', then extract the tar file to tomcat webapps folder


# switch npm source 
npm config set registry https://registry.npm.taobao.org
npm config get registry

# 1. install dep
npm install


# 2. apply patch
diff patch/g6.min.js node_modules/@antv/g6/dist/g6.min.js -q &> /dev/null
diff_ret=$?

if (( $diff_ret != 0 )); then
	echo "apply patch g6.min.js !!!!!"
	cp patch/g6.min.js node_modules/@antv/g6/dist/
fi


# 3. build 
npm run build

# 4. pack
mv dist Expressway
tar czvf Expressway.tar.gz Expressway
rm -r Expressway