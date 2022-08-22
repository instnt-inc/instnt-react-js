#!/bin/bash

npm install
npm run build
echo "Build completed on `date`"
pwd
echo "Publishing to NPM"

npm publish --tag beta
echo "successfully published" 


cat src/version.ts

cd ..
pwd

a=$(awk 'NR==8 {print  }'  examples/forms/package.json)
echo ${a}
b=$(awk 'NR==8 {print $1 }'  examples/forms/package.json)
echo ${b}
c=$(awk 'NR==3 {print $NF}'  components/package.json)
echo ${c}

sed -i "s+${a}+    ${b} ${c}+" examples/forms/package.json


cat examples/forms/package.json
