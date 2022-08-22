#!/bin/bash

x=$(awk -F'[ .]' '/"version"/ {print $7*1}' package.json)
sed -i "s/-beta.${x}//g" package.json

npm publish
echo "successfully published" 

cd ..
pwd

a=$(awk 'NR==8 {print  }'  examples/forms/package.json)
echo ${a}
b=$(awk 'NR==8 {print $1 }'  examples/forms/package.json)
echo ${b}
c=$(awk 'NR==3 {print $NF}'  components/package.json)
echo ${c}

sed -i "s+${a}+    ${b} ${c}+" examples/forms/package.json

echo ${a}

