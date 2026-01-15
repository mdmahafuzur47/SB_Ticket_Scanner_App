# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep Bluetooth ESC/POS Printer library classes
-keep class com.vardrz.reactnative.bluetoothescposprinter.** { *; }
-keepclassmembers class com.vardrz.reactnative.bluetoothescposprinter.** { *; }

# Keep Bluetooth related classes
-keep class android.bluetooth.** { *; }
-keep interface android.bluetooth.** { *; }

# Keep React Native Bluetooth library
-dontwarn com.vardrz.reactnative.bluetoothescposprinter.**

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep all React Native packages
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Bluetooth printer specific
-keep class net.posprinter.** { *; }
-dontwarn net.posprinter.**
