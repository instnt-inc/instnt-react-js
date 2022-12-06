#!/bin/bash

pwd

if [[ ${Environment} == prod2 ]]; then
    x=$(awk -F'[ .]' '/"version"/ {print $7*1}' package.json)
    sed -i "s/-beta.${x}//g" package.json
fi

npm install
npm run build
echo "Build completed on `date`"
pwd

cat src/version.ts

if [[ ${Environment} == dev2 ]]; then
    echo "Publishing to NPM with beta tag"
    npm publish --tag beta
    echo "successfully published"
fi

if [[ ${Environment} == prod2 ]]; then
    echo "Publishing to NPM"
    npm publish
    echo "successfully published"
fi

pwd
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
