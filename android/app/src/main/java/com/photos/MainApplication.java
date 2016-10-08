package com.photos;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.image.zoom.ReactImageZoom;
import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactImageZoom(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNDeviceInfo(),
            new RNAdMobPackage(),
            new RNSoundPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
