#!/usr/bin/env bash
# 自动把 HTML 里所有 ?v=数字 更新为当前时间戳

set -e

# 要处理的文件：当前目录及子目录下所有 .html
# 如果你只想处理指定目录，把 . 改成路径，比如 ./pages
FILES=$(find . -type f -name "*.html" -not -path "./node_modules/*")

V=$(date +%s)
echo "新版本号: $V"

for f in $FILES; do
    # 用 sed 替换 ?v=任意数字 为 ?v=新时间戳
    # macOS 的 sed 需要 -i ''
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' -E "s/\?v=[0-9]+/?v=$V/g" "$f"
    else
        sed -i -E "s/\?v=[0-9]+/?v=$V/g" "$f"
    fi
    echo "  更新: $f"
done

echo "完成 ✅"
