#! /bin/bash

cd ./platforms/android && ant release;
adb -d install -r ./bin/BeatFlipzMobile-release.apk