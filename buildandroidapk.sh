#! /bin/bash

cd ./platforms/android && ant release;
adb -d install -r ./ant-build/BeatFlipz-release.apk
