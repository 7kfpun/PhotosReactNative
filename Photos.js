import React from 'react';

import {
  Platform,
} from 'react-native';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';

import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

// Views
import MainView from './app/main';
import PhotoBrowserView from './app/photo-browser';

import { config } from './app/config';

GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getManufacturer() === 'Genymotion') {
  GoogleAnalytics.setDryRun(true);
}

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Look Lock'} component={MainView} hideNavBar={true} initial={true} />
    <Scene key="photoBrowser" component={PhotoBrowserView} hideNavBar={true} panHandlers={null} />
  </Scene>
);

const Photos = function Photos() {
  return <Router scenes={scenes} />;
};

export default Photos;
