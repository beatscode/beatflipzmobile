#!/bin/bash

cd platforms/android/;
#pwd;
ant release;
adb -d install -r bin/BeatFlipz-release.apk
