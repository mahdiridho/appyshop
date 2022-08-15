#!/bin/bash

npm run build
pushd build
aws --profile crossaccount s3 sync . s3://jc.demo.shop --delete --sse AES256 --cache-control no-cache
aws --profile crossaccount s3 cp s3://jc.demo.shop/ s3://jc.demo.shop/ --exclude "*" --include "/data/images/**/*" --include "/images/**/*" --recursive --metadata-directive REPLACE --sse AES256 --cache-control max-age=604800
aws --profile crossaccount s3 cp s3://jc.demo.shop/ s3://jc.demo.shop/ --exclude "*" --include "/data/**/*.json" --metadata-directive REPLACE --sse AES256 --cache-control max-age=604800 --content-type application/json
aws --profile crossaccount s3 cp s3://jc.demo.shop/ s3://jc.demo.shop/ --exclude "*" --include "*.js" --exclude "pwabuilder-sw.js" --recursive --metadata-directive REPLACE --sse AES256 --cache-control max-age=604800 --content-type application/javascript
popd