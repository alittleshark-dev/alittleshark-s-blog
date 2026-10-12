#!/usr/bin/env bash
ServerIP2=64.90.30.167
set -e
./auto-version.sh

rsync -avz --delete ./ root@$ServerIP2:/var/www/alittleshark-blog

echo "完成"
