#!/bin/bash

set -e  # Enable exit on error

function on_error {
  echo "Error occurred. Script terminated." >&2
}

# Set up the trap
trap on_error ERR

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

a=$(grep @instnt/instnt-react-js examples/forms/package.json)
echo ${a}
b=$(echo ${a} | awk '{print $1 }')
echo ${b}
c=$(awk '/"version"/ {print $2}'  components/package.json)
echo ${c}

sed -i "s+${a}+    ${b} ${c}+" examples/forms/package.json

cat examples/forms/package.json
