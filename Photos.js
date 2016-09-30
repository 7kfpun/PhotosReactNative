import React from 'react';

import {
  Platform,
} from 'react-native';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import store from 'react-native-simple-store';

// Views
import MainView from './app/main';
import PhotoBrowserView from './app/photo-browser';
import InfoView from './app/info';
import PasswordView from './app/password';

import { config } from './app/config';

GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getDeviceName() === 'apple’s MacBook Pro' || DeviceInfo.getManufacturer() === 'Genymotion') {
  console.log('GoogleAnalytics setDryRun');
  GoogleAnalytics.setDryRun(true);
}

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Look Lock'} component={MainView} hideNavBar={true} initial={true} />
    <Scene key="password" title={'Set password'} component={PasswordView} hideNavBar={true} panHandlers={null} />
    <Scene key="photoBrowser" component={PhotoBrowserView} hideNavBar={true} panHandlers={Platform.OS === 'ios' ? null : undefined} />
    <Scene key="info" component={InfoView} direction="vertical" />
  </Scene>
);

store.delete('password');

const Photos = function Photos() {
  return <Router scenes={scenes} onExitApp={() => { store.delete('password'); return false; }} />;
};

export default Photos;
