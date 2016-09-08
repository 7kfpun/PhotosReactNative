import React from 'react';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';

// Views
import MainView from './app/main';
import PhotoBrowserView from './app/photo-browser';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Photos'} component={MainView} hideNavBar={true} initial={true} type="reset" />
    <Scene key="photoBrowser" title={'Photos'} component={PhotoBrowserView} hideNavBar={true} type="reset" />
  </Scene>
);

const Photos = function Photos() {
  return <Router scenes={scenes} />;
};

export default Photos;
